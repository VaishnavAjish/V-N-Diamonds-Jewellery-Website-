import { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../components/AdminLayout';
import { apiFetch, API_BASE } from '../lib/api';

export default function MemosPage() {
  const [memos, setMemos] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMemoId, setOpenMemoId] = useState(null); // which memo's action dropdown is open
  const [returnMemoId, setReturnMemoId] = useState(null); // which memo is in the return-picker modal

  // create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [clientMode, setClientMode] = useState('existing'); // existing | new
  const [selectedClientId, setSelectedClientId] = useState('');
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', company: '', address: '' });
  const [productSearch, setProductSearch] = useState('');
  const [lineItems, setLineItems] = useState([]); // [{productId, sku, title, img, qty, price}]
  const [submitting, setSubmitting] = useState(false);

  // return picker state
  const [selectedReturnItems, setSelectedReturnItems] = useState([]);

  // edit / delete state
  const [editMemo, setEditMemo] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [deleteMemoId, setDeleteMemoId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [memoData, clientData, productData, invoiceData] = await Promise.all([
        apiFetch('/api/memo/all').catch(() => ({ data: [] })),
        apiFetch('/api/client/all').catch(() => ({ data: [] })),
        apiFetch('/api/product/all').catch(() => ({ data: [] })),
        apiFetch('/api/invoice/all').catch(() => ({ data: [] })),
      ]);
      const realMemos = (memoData?.data || []).map((m) => ({ ...m, __source: 'memo' }));
      // standalone unpaid invoices (not already represented by a linked memo) show up here too, tagged as memos
      const unpaidStandaloneInvoices = (invoiceData?.data || [])
        .filter((inv) => inv.status !== 'paid' && !inv.memoId)
        .map((inv) => ({
          id: inv.id,
          memoNumber: inv.invoiceNumber,
          client: inv.client,
          items: (inv.items || []).filter((i) => !i.__header__).map((i) => ({
            productId: i.productId, sku: i.sku || i.lotId || '', title: i.title || i.lotName || 'Item', qty: i.qty, price: i.price ?? i.docPriceGross,
          })),
          status: 'open',
          createdAt: inv.createdAt,
          __source: 'invoice',
        }));
      setMemos([...realMemos, ...unpaidStandaloneInvoices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setClients(clientData?.data || []);
      setProducts(productData?.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const resetCreateForm = () => {
    setClientMode('existing');
    setSelectedClientId('');
    setNewClient({ name: '', email: '', phone: '', company: '', address: '' });
    setLineItems([]);
    setProductSearch('');
  };

  const addLineItem = (product) => {
    if (lineItems.some((li) => li.productId === (product.id || product._id))) return;
    setLineItems([...lineItems, {
      productId: product.id || product._id,
      sku: product.sku || '',
      title: product.title,
      img: product.img || '',
      qty: 1,
      price: product.price || 0,
    }]);
  };

  const updateLineItemQty = (productId, qty) => {
    setLineItems(lineItems.map((li) => li.productId === productId ? { ...li, qty: Math.max(1, qty) } : li));
  };

  const removeLineItem = (productId) => {
    setLineItems(lineItems.filter((li) => li.productId !== productId));
  };

  const handleCreateMemo = async (e) => {
    e.preventDefault();
    if (lineItems.length === 0) {
      alert('Add at least one item');
      return;
    }
    if (clientMode === 'existing' && !selectedClientId) {
      alert('Select a client');
      return;
    }
    if (clientMode === 'new' && !newClient.name) {
      alert('Enter a client name');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        items: lineItems,
        ...(clientMode === 'existing' ? { clientId: selectedClientId } : { newClient }),
      };
      const res = await fetch(`${API_BASE}/api/memo/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        resetCreateForm();
        load();
      } else {
        alert('Failed to create memo: ' + data.message);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnSubmit = async (memoId) => {
    if (selectedReturnItems.length === 0) {
      alert('Select at least one item to return');
      return;
    }
    
    const memoObj = memos.find(m => m.id === memoId);
    const isInvoice = memoObj?.__source === 'invoice';
    const endpoint = isInvoice ? `/api/invoice/${memoId}/return` : `/api/memo/${memoId}/return`;
    const payload = isInvoice ? { returnLineIndexes: selectedReturnItems } : { returnedProductIds: selectedReturnItems };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setReturnMemoId(null);
        setSelectedReturnItems([]);
        load();
      } else {
        alert('Failed to return items: ' + data.message);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleConvertToInvoice = async (memoId) => {
    if (!confirm('Create an invoice for the remaining items on this memo?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/memo/${memoId}/invoice`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setOpenMemoId(null);
        load();
        alert(`Invoice #${data.data.invoiceNumber} created for $${data.data.amount.toLocaleString()}`);
      } else {
        alert('Failed to create invoice: ' + data.message);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const isInvoice = editMemo.__source === 'invoice';
      const endpoint = isInvoice ? `/api/invoice/${editMemo.id}` : `/api/memo/${editMemo.id}`;
      // For invoices, we store notes in `internalRemarks` instead of `notes`
      const body = isInvoice ? { internalRemarks: editNotes } : { notes: editNotes };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) { setEditMemo(null); load(); }
      else { alert('Failed to update: ' + data.message); }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteMemo = async (id) => {
    const memoObj = memos.find(m => m.id === id);
    const isInvoice = memoObj?.__source === 'invoice';
    const endpoint = isInvoice ? `/api/invoice/${id}` : `/api/memo/${id}`;
    
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { setDeleteMemoId(null); load(); }
      else { alert(data.message); setDeleteMemoId(null); }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const filteredProducts = products.filter((p) =>
    (p.title || '').toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(productSearch.toLowerCase())
  ).slice(0, 20);

  const statusBadge = (s) => {
    const map = { open: 'badge-blue', partial: 'badge-yellow', returned: 'badge-gray', invoiced: 'badge-green' };
    return <span className={`badge ${map[s] || 'badge-gray'}`}>{s}</span>;
  };

  const memoTotal = (items) => items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty) || 1), 0);

  return (
    <>
      <Head><title>Memos — Harene Diamonds Admin</title></Head>
      <AdminLayout title="Memos" subtitle={`${memos.length} total memos`}>
        <div className="page-header">
          <div>
            <h1>Memos</h1>
            <p>Track goods sent to clients on approval — return unsold items or convert to an invoice</p>
          </div>
          <button className="btn btn-primary" onClick={() => { resetCreateForm(); setShowCreateModal(true); }}>
            ➕ Create Memo
          </button>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} /></div>
        ) : memos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div>No memos yet</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Memo #</th>
                  <th>Client</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {memos.map((memo) => (
                  <tr key={memo.id}>
                    <td className="td-mono">#{memo.memoNumber}</td>
                    <td>
                      <div className="td-primary">{memo.client?.name}</div>
                      <div className="text-muted text-sm">{memo.client?.email || memo.client?.phone || ''}</div>
                    </td>
                    <td>
                      {memo.items.length === 0 ? '—' : memo.items.map((i) => `${i.title} (${i.sku}) x${i.qty}`).join(', ')}
                    </td>
                    <td className="td-primary">${memoTotal(memo.items).toLocaleString()}</td>
                    <td>
                      {statusBadge(memo.status)}
                      {memo.__source === 'invoice' && <span className="badge badge-yellow" style={{ marginLeft: 6 }}>Memo (unpaid invoice)</span>}
                    </td>
                    <td className="text-muted text-sm">{new Date(memo.createdAt).toLocaleDateString()}</td>
                    <td style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <button className="btn btn-sm" onClick={() => { setEditMemo(memo); setEditNotes(memo.notes || ''); }}>✏️ Edit</button>
                        <button className="btn btn-sm" disabled={memo.items.length === 0} onClick={() => { setReturnMemoId(memo.id); setSelectedReturnItems([]); }}>↩️ Return</button>
                        <button className="btn btn-sm btn-danger" onClick={() => setDeleteMemoId(memo.id)}>🗑️</button>
                        <button className="btn btn-sm" onClick={() => setOpenMemoId(openMemoId === memo.id ? null : memo.id)}>
                          More ▾
                        </button>
                      </div>
                      {openMemoId === memo.id && (
                        <div style={{ position: 'absolute', top: '100%', right: 0, zIndex: 10, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: 160 }}>
                          <button
                            className="btn btn-sm"
                            style={{ width: '100%', textAlign: 'left', border: 'none', borderRadius: 0 }}
                            disabled={memo.items.length === 0}
                            onClick={() => handleConvertToInvoice(memo.id)}
                          >
                            🧾 Create Invoice
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create Memo Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal modal-lg">
              <div className="modal-title">
                <span>➕ Create New Memo</span>
                <button className="btn btn-sm" onClick={() => setShowCreateModal(false)}>✕</button>
              </div>
              <form onSubmit={handleCreateMemo} className="modal-scroll">
                <div className="form-group">
                  <label className="form-label">Client</label>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <label><input type="radio" checked={clientMode === 'existing'} onChange={() => setClientMode('existing')} /> Existing client</label>
                    <label><input type="radio" checked={clientMode === 'new'} onChange={() => setClientMode('new')} /> New client</label>
                  </div>
                  {clientMode === 'existing' ? (
                    <select className="form-control" value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}>
                      <option value="">Select Client</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ''}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="form-row">
                      <input className="form-control" placeholder="Full Name *" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} />
                      <input className="form-control" placeholder="Company" value={newClient.company} onChange={(e) => setNewClient({ ...newClient, company: e.target.value })} />
                      <input className="form-control" placeholder="Email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} />
                      <input className="form-control" placeholder="Phone" value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} />
                      <input className="form-control" placeholder="Address" value={newClient.address} onChange={(e) => setNewClient({ ...newClient, address: e.target.value })} />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Add Items (search by name or SKU)</label>
                  <input className="form-control" placeholder="Search products..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
                  {productSearch && (
                    <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 8, marginTop: 6 }}>
                      {filteredProducts.map((p) => (
                        <div key={p.id || p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => addLineItem(p)}>
                          <span>{p.title} <span className="text-muted text-sm">({p.sku})</span></span>
                          <span className="text-muted text-sm">${p.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {lineItems.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">Memo Items</label>
                    <table style={{ width: '100%' }}>
                      <thead>
                        <tr><th>Item</th><th>SKU</th><th>Qty</th><th>Price</th><th></th></tr>
                      </thead>
                      <tbody>
                        {lineItems.map((li) => (
                          <tr key={li.productId}>
                            <td>{li.title}</td>
                            <td className="td-mono">{li.sku}</td>
                            <td>
                              <input type="number" min="1" className="form-control" style={{ width: 60 }} value={li.qty} onChange={(e) => updateLineItemQty(li.productId, parseInt(e.target.value) || 1)} />
                            </td>
                            <td>${li.price}</td>
                            <td><button type="button" className="btn btn-sm btn-danger" onClick={() => removeLineItem(li.productId)}>✕</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p style={{ textAlign: 'right', fontWeight: 600, marginTop: 8 }}>Total: ${memoTotal(lineItems).toLocaleString()}</p>
                  </div>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? <div className="spinner" /> : 'Create Memo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Memo Return Modal */}
        {returnMemoId && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-title">
                <span>↩️ Memo Return</span>
                <button className="btn btn-sm" onClick={() => setReturnMemoId(null)}>✕</button>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Select the items being returned. They'll be removed from this memo and restocked.</p>
              {memos.find((m) => m.id === returnMemoId)?.items.map((item, idx) => {
                const isInvoice = memos.find((m) => m.id === returnMemoId)?.__source === 'invoice';
                if (isInvoice && item.__header__) return null;
                const key = isInvoice ? idx : item.productId;
                
                return (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <input
                      type="checkbox"
                      checked={selectedReturnItems.includes(key)}
                      onChange={(e) => {
                        setSelectedReturnItems(e.target.checked
                          ? [...selectedReturnItems, key]
                          : selectedReturnItems.filter((id) => id !== key));
                      }}
                    />
                    <span>{isInvoice 
                      ? `${item.lotName || item.lotId || `Line ${idx + 1}`} — qty ${item.qty || 1} — $${item.docPriceGross || item.price || 0}`
                      : `${item.title} (${item.sku}) — qty ${item.qty} — $${item.price}`
                    }</span>
                  </label>
                );
              })}
              <div className="modal-actions">
                <button className="btn" onClick={() => setReturnMemoId(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => handleReturnSubmit(returnMemoId)}>Confirm Return</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Memo Modal */}
        {editMemo && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-title">
                <span>✏️ Edit Memo #{editMemo.memoNumber}</span>
                <button className="btn btn-sm" onClick={() => setEditMemo(null)}>✕</button>
              </div>
              <div className="form-group">
                <label className="form-label">Client</label>
                <p className="text-muted">{editMemo.client?.name}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-control" rows={4} value={editNotes} onChange={(e) => setEditNotes(e.target.value)} />
              </div>
              <div className="modal-actions">
                <button className="btn" onClick={() => setEditMemo(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleEditSubmit}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Memo Modal */}
        {deleteMemoId && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-title">
                <span>⚠️ Confirm Delete</span>
                <button className="btn btn-sm" onClick={() => setDeleteMemoId(null)}>✕</button>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                Delete this memo? This cannot be undone. If it has a linked invoice, delete the invoice first.
              </p>
              <div className="modal-actions">
                <button className="btn" onClick={() => setDeleteMemoId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDeleteMemo(deleteMemoId)}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
