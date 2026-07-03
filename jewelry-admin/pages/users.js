import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '../components/AdminLayout';
import { apiFetch } from '../lib/api';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Edit states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { router.push('/'); return; }
    load();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    ));
  }, [search, users]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/user/all');
      const list = Array.isArray(data) ? data : (data?.users || data?.data || []);
      setUsers(list);
      setFiltered(list);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openEditModal = (u) => {
    setEditId(u._id || u.id);
    setName(u.name || '');
    setEmail(u.email || '');
    setPhone(u.phone || u.contactNumber || '');
    setShowEditModal(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch(`/api/user/update-user/${editId}`, {
        method: 'PUT',
        body: JSON.stringify({ name, email, phone }),
      });
      setShowEditModal(false);
      load();
    } catch (err) {
      alert('Failed to update user: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    setDeleteId(id);
    try {
      await apiFetch(`/api/user/delete-user/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      alert('Failed to delete customer: ' + err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const statusBadge = (s) => {
    const map = { active: 'badge-green', inactive: 'badge-red', blocked: 'badge-red' };
    return <span className={`badge ${map[s] || 'badge-gray'}`}>{s || 'active'}</span>;
  };

  return (
    <>
      <Head><title>Customers — Harene Diamonds Admin</title></Head>
      <AdminLayout title="Customers" subtitle={`${users.length} registered customers`}>
        <div className="page-header">
          <div><h1>All Customers</h1><p>View and manage registered users</p></div>
        </div>

        <div className="search-bar">
          <span>🔍</span>
          <input
            placeholder="Search by name, email, or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="text-muted text-sm">{filtered.length} found</span>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div>No customers found</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id || u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0
                        }}>
                          {(u.name || 'U')[0].toUpperCase()}
                        </div>
                        <span className="td-primary">{u.name || '—'}</span>
                      </div>
                    </td>
                    <td className="text-muted">{u.email}</td>
                    <td>{u.phone || u.contactNumber || '—'}</td>
                    <td><span className="badge badge-blue">{u.role || 'user'}</span></td>
                    <td>{statusBadge(u.status)}</td>
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => openEditModal(u)} style={{ marginRight: 8 }}>✏️ Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u._id || u.id)} disabled={deleteId === (u._id || u.id)}>
                        {deleteId === (u._id || u.id) ? '...' : '🗑️ Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-title">
                <span>✏️ Edit Customer</span>
                <button className="btn btn-sm" onClick={() => setShowEditModal(false)}>✕</button>
              </div>
              <form onSubmit={handleEdit} className="modal-scroll">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? <div className="spinner" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </AdminLayout>
    </>
  );
}
