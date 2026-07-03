const prisma = require('../prisma/client');

// standalone invoice creation — all form fields packed into items JSON (schema has no meta field)
exports.createInvoice = async (req, res, next) => {
  try {
    const {
      clientId, newClient,
      terms, date, currency, itemType, trackingNo,
      ref1, details, remarks, internalRemarks, signedByUser, status,
      lines,
      amount
    } = req.body;

    if (!lines || lines.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one line item is required' });
    }

    // Resolve client — if clientId is not a valid UUID, treat as new client name
    let resolvedClientId = null;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (clientId && uuidRegex.test(clientId)) {
      resolvedClientId = clientId;
    } else {
      // clientId is not a UUID — use it as a name or fall back to newClient
      const clientName = (clientId && !uuidRegex.test(clientId)) ? String(clientId) : newClient?.name;
      if (clientName) {
        // Try to find existing client by name first
        let existing = await prisma.client.findFirst({ where: { name: clientName } });
        if (!existing) {
          existing = await prisma.client.create({
            data: {
              name: clientName,
              address: newClient?.address || req.body.clientAddress || '',
              email: newClient?.email || '',
              phone: newClient?.phone || '',
            }
          });
        }
        resolvedClientId = existing.id;
      }
    }

    if (!resolvedClientId) {
      return res.status(400).json({ success: false, message: 'Please provide a valid client name or account.' });
    }

    // Compute total from lines
    const computedAmount = (typeof amount === 'number' && amount > 0)
      ? amount
      : lines.reduce((sum, line) => sum + (Number(line.docPriceGross) || 0) * (Number(line.qty) || 1), 0);

    // Store header info inside a special __header__ entry in items (schema has no meta field)
    const itemsWithHeader = JSON.parse(JSON.stringify([
      {
        __header__: true,
        terms, date, currency, itemType, trackingNo,
        ref1, details, remarks, internalRemarks, signedByUser
      },
      ...lines
    ]));

    const invoice = await prisma.invoice.create({
      data: {
        clientId: resolvedClientId,
        items: itemsWithHeader,
        amount: computedAmount,
        status: status === 'Active' ? 'unpaid' : (status || 'unpaid'),
      },
      include: { client: true },
    });

    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    console.error('[createInvoice error]', error);
    next(error);
  }
};

exports.getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
};

exports.getSingleInvoice = async (req, res, next) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { client: true },
    });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

// update invoice fields / status. status is stored as 'paid' | 'unpaid' internally
// ("Invoice" = paid/finalized, "Memo" = unpaid/still returnable, per admin UI labels)
exports.updateInvoice = async (req, res, next) => {
  try {
    const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const { status, clientId, newClient, terms, date, currency, itemType, trackingNo, ref1, details, remarks, internalRemarks, signedByUser, lines, amount, ...rest } = req.body;
    const data = { ...rest };
    if (status) data.status = status;

    // If lines/full payload is provided, process it like createInvoice
    if (lines && Array.isArray(lines)) {
      // Resolve client
      let resolvedClientId = invoice.clientId;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (clientId && uuidRegex.test(clientId)) {
        resolvedClientId = clientId;
      } else if (clientId || newClient?.name) {
        const clientName = (clientId && !uuidRegex.test(clientId)) ? String(clientId) : newClient?.name;
        if (clientName) {
          let existing = await prisma.client.findFirst({ where: { name: clientName } });
          if (!existing) {
            existing = await prisma.client.create({
              data: {
                name: clientName,
                address: newClient?.address || req.body.clientAddress || '',
                email: newClient?.email || '',
                phone: newClient?.phone || '',
              }
            });
          }
          resolvedClientId = existing.id;
        }
      }
      
      if (resolvedClientId) data.clientId = resolvedClientId;
      
      const computedAmount = (typeof amount === 'number' && amount > 0)
        ? amount
        : lines.reduce((sum, line) => sum + (Number(line.docPriceGross) || 0) * (Number(line.qty) || 1), 0);
      data.amount = computedAmount;
      
      data.items = JSON.parse(JSON.stringify([
        {
          __header__: true,
          terms, date, currency, itemType, trackingNo,
          ref1, details, remarks, internalRemarks, signedByUser
        },
        ...lines
      ]));
    }

    const updated = await prisma.invoice.update({
      where: { id: req.params.id },
      data,
      include: { client: true },
    });

    // keep the linked memo's visibility in sync with paid status
    if (status && invoice.memoId) {
      await prisma.memo.update({
        where: { id: invoice.memoId },
        data: { status: status === 'paid' ? 'closed' : 'linked' },
      }).catch(() => {});
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('ERROR in updateInvoice:', error);
    next(error);
  }
};

exports.deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    await prisma.invoice.delete({ where: { id: req.params.id } });

    // if this invoice came from a memo, restore the memo to visible/open status
    if (invoice.memoId) {
      await prisma.memo.update({
        where: { id: invoice.memoId },
        data: { status: 'open' },
      }).catch(() => {});
    }

    res.status(200).json({ success: true, message: 'Invoice deleted' });
  } catch (error) {
    next(error);
  }
};

// return selected line items from an invoice — removes them and reduces the amount.
// Lines are lot-based entries (lotId/docPriceGross), not linked Product records, so
// items are matched by their position among non-header lines, and there's nothing to restock.
exports.returnInvoiceItems = async (req, res, next) => {
  try {
    const { returnedLineIndexes } = req.body; // indexes into the non-header items array
    if (!returnedLineIndexes || returnedLineIndexes.length === 0) {
      return res.status(400).json({ success: false, message: 'returnedLineIndexes is required' });
    }

    const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const returnedSet = new Set(returnedLineIndexes);
    let lineIndex = -1;
    const remainingItems = invoice.items.filter((item) => {
      if (item.__header__) return true;
      lineIndex += 1;
      return !returnedSet.has(lineIndex);
    });

    const newAmount = remainingItems
      .filter((item) => !item.__header__)
      .reduce((sum, item) => sum + (Number(item.price ?? item.docPriceGross) || 0) * (Number(item.qty) || 1), 0);

    const updated = await prisma.invoice.update({
      where: { id: req.params.id },
      data: { items: remainingItems, amount: newAmount },
      include: { client: true },
    });

    res.status(200).json({ success: true, message: 'Items returned', data: updated });
  } catch (error) {
    next(error);
  }
};
