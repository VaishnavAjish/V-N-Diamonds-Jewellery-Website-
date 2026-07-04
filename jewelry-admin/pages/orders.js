import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '../components/AdminLayout';
import { apiFetch } from '../lib/api';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { router.push('/'); return; }
    load();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(orders.filter(o =>
      (o.name || '').toLowerCase().includes(q) ||
      (o.email || '').toLowerCase().includes(q) ||
      (o.status || '').toLowerCase().includes(q)
    ));
  }, [search, orders]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/order/orders');
      const list = Array.isArray(data) ? data : (data?.orders || []);
      setOrders(list);
      setFiltered(list);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await apiFetch(`/api/order/update-status/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setSelected(null);
      load();
    } catch (e) { alert('Update failed: ' + e.message); }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/api/order/delete/${id}`, { method: 'DELETE' });
      setDeleteId(null);
      load();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const statusBadge = (s) => {
    const map = { Pending: 'yellow', Processing: 'blue', Delivered: 'green', Cancelled: 'red' };
    return <span className={`badge badge-${map[s] || 'gray'}`}>{s}</span>;
  };

  return (
    <>
      <Head><title>Orders — Harene Diamonds Admin</title></Head>
      <AdminLayout title="Orders" subtitle={`${orders.length} total orders`}>
        <div className="page-header">
          <div><h1>All Orders</h1><p>Track and manage customer orders</p></div>
        </div>

        <div className="search-bar">
          <span>🔍</span>
          <input
            placeholder="Search by customer name, email, or status…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="text-muted text-sm">{filtered.length} found</span>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div>No orders found</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o._id || o.id}>
                    <td className="td-primary">{o.name}</td>
                    <td className="text-muted text-sm">{o.email}</td>
                    <td>{o.city}, {o.country}</td>
                    <td><span className="badge badge-blue">{o.paymentMethod}</span></td>
                    <td className="td-primary">${Number(o.totalAmount || 0).toLocaleString('en-US')}</td>
                    <td>{statusBadge(o.status)}</td>
                    <td>
                      <button className="btn btn-sm btn-primary" style={{ marginRight: 8 }} onClick={() => setSelected(o)}>✏️ Status</button>
                      <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(o._id || o.id)}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Update Status Modal */}
        {selected && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-title">
                <span>📦 Update Order Status</span>
                <button className="btn btn-sm" onClick={() => setSelected(null)}>✕</button>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>
                Customer: <strong>{selected.name}</strong> — Total: ${Number(selected.totalAmount).toLocaleString('en-US')}
              </p>
              <div className="form-group">
                <label className="form-label">New Status</label>
                <select
                  className="form-control"
                  defaultValue={selected.status}
                  id="status-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="modal-actions">
                <button className="btn" onClick={() => setSelected(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => {
                  const s = document.getElementById('status-select').value;
                  updateStatus(selected._id || selected.id, s);
                }}>Update</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {deleteId && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-title">
                <span>⚠️ Confirm Delete</span>
                <button className="btn btn-sm" onClick={() => setDeleteId(null)}>✕</button>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                Are you sure you want to delete this order? This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="btn" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
              </div>
            </div>
          </div>
        )}

      </AdminLayout>
    </>
  );
}
