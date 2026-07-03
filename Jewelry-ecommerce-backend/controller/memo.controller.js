const prisma = require('../prisma/client');

// create a new memo (goods sent to a client on approval)
exports.createMemo = async (req, res, next) => {
  try {
    const { status, clientId, newClient, terms, date, currency, itemType, trackingNo, ref1, details, remarks, internalRemarks, signedByUser, lines, notes } = req.body;
    if (!lines || lines.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one item is required' });
    }

    let resolvedClientId = clientId;
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
    if (!resolvedClientId) {
      return res.status(400).json({ success: false, message: 'clientId or newClient is required' });
    }

    const itemsWithHeader = JSON.parse(JSON.stringify([
      {
        __header__: true,
        terms, date, currency, itemType, trackingNo,
        ref1, details, remarks, internalRemarks, signedByUser
      },
      ...lines
    ]));

    const memo = await prisma.memo.create({
      data: {
        clientId: resolvedClientId,
        items: itemsWithHeader,
        notes: notes || internalRemarks || null,
        status: status || 'open',
      },
      include: { client: true },
    });

    res.status(200).json({ success: true, data: memo });
  } catch (error) {
    next(error);
  }
};

// edit a memo's notes/items (client and status are managed via dedicated actions)
exports.updateMemo = async (req, res, next) => {
  try {
    const { status, clientId, newClient, terms, date, currency, itemType, trackingNo, ref1, details, remarks, internalRemarks, signedByUser, lines, notes } = req.body;
    const data = {};
    if (notes !== undefined) data.notes = notes;
    if (internalRemarks !== undefined && notes === undefined) data.notes = internalRemarks;
    if (status !== undefined) data.status = status;

    if (lines && Array.isArray(lines)) {
      const memo = await prisma.memo.findUnique({ where: { id: req.params.id } });
      if (!memo) return res.status(404).json({ success: false, message: 'Memo not found' });
      
      let resolvedClientId = memo.clientId;
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
      
      data.items = JSON.parse(JSON.stringify([
        {
          __header__: true,
          terms, date, currency, itemType, trackingNo,
          ref1, details, remarks, internalRemarks, signedByUser
        },
        ...lines
      ]));
    }

    const memo = await prisma.memo.update({
      where: { id: req.params.id },
      data,
      include: { client: true },
    });
    res.status(200).json({ success: true, data: memo });
  } catch (error) {
    next(error);
  }
};

exports.deleteMemo = async (req, res, next) => {
  try {
    await prisma.memo.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true, message: 'Memo deleted' });
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ success: false, message: 'Cannot delete a memo that has a linked invoice. Delete the invoice first.' });
    }
    next(error);
  }
};

// list all memos, most recent first
exports.getAllMemos = async (req, res, next) => {
  try {
    const memos = await prisma.memo.findMany({
      where: { status: { not: 'closed' } }, // closed = the linked invoice has been paid
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: memos });
  } catch (error) {
    next(error);
  }
};

exports.getSingleMemo = async (req, res, next) => {
  try {
    const memo = await prisma.memo.findUnique({
      where: { id: req.params.id },
      include: { client: true, invoices: true },
    });
    if (!memo) return res.status(404).json({ success: false, message: 'Memo not found' });
    res.status(200).json({ success: true, data: memo });
  } catch (error) {
    next(error);
  }
};

// return selected items from a memo — removes them from the memo and restocks the product quantity
exports.returnMemoItems = async (req, res, next) => {
  try {
    const { returnedProductIds } = req.body; // array of productId to return
    if (!returnedProductIds || returnedProductIds.length === 0) {
      return res.status(400).json({ success: false, message: 'returnedProductIds is required' });
    }

    const memo = await prisma.memo.findUnique({ where: { id: req.params.id } });
    if (!memo) return res.status(404).json({ success: false, message: 'Memo not found' });

    const returnedSet = new Set(returnedProductIds);
    const returnedItems = memo.items.filter((item) => returnedSet.has(item.productId));
    const remainingItems = memo.items.filter((item) => !returnedSet.has(item.productId));

    // restock returned quantities back onto each product
    for (const item of returnedItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { quantity: { increment: item.qty || 1 } },
      }).catch(() => {}); // ignore if product was since deleted
    }

    const status = remainingItems.length === 0 ? 'returned' : 'partial';
    const updated = await prisma.memo.update({
      where: { id: req.params.id },
      data: { items: remainingItems, status },
      include: { client: true },
    });

    res.status(200).json({ success: true, message: 'Items returned', data: updated });
  } catch (error) {
    next(error);
  }
};

// convert the memo's remaining items into an invoice, autofilled from the memo's client/items
exports.convertMemoToInvoice = async (req, res, next) => {
  try {
    const memo = await prisma.memo.findUnique({ where: { id: req.params.id } });
    if (!memo) return res.status(404).json({ success: false, message: 'Memo not found' });
    if (memo.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Memo has no remaining items to invoice' });
    }

    const amount = memo.items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1), 0);

    const invoice = await prisma.invoice.create({
      data: {
        clientId: memo.clientId,
        memoId: memo.id,
        items: memo.items,
        amount,
      },
      include: { client: true },
    });

    // memo stays visible (with its items intact) until the invoice is marked paid
    await prisma.memo.update({ where: { id: memo.id }, data: { status: 'linked' } });

    res.status(200).json({ success: true, message: 'Invoice created', data: invoice });
  } catch (error) {
    next(error);
  }
};
