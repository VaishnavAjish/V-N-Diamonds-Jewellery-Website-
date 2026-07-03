import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '../components/AdminLayout';
import { apiFetch, API_BASE } from '../lib/api';

export default function StaffPage() {
  const router = useRouter();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Staff');
  const [image, setImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { router.push('/'); return; }
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/admin/all');
      const list = Array.isArray(data) ? data : (data?.admins || data?.staff || data?.data || []);
      setStaff(list);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_BASE}/api/cloudinary/add-img`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        setImage(data.data.url);
      } else {
        alert('Upload failed: ' + (data.message || 'unknown error'));
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || (!password && !editId)) {
      alert('Name, email, and password are required');
      return;
    }
    setSubmitting(true);
    try {
      const payload = { name, email, phone, role, image };
      if (password) payload.password = password;
      
      if (editId) {
        await apiFetch(`/api/admin/update-stuff/${editId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/api/admin/add', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setShowAddModal(false);
      resetForm();
      load();
    } catch (err) {
      alert('Failed to save staff: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/api/admin/${id}`, { method: 'DELETE' });
      setDeleteId(null);
      load();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const openEditModal = (s) => {
    setEditId(s._id || s.id);
    setName(s.name || '');
    setEmail(s.email || '');
    setPassword('');
    setPhone(s.phone || '');
    setRole(s.role || 'Staff');
    setImage(s.image || '');
    setShowAddModal(true);
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setRole('Staff');
    setImage('');
  };

  const roleBadge = (r) => {
    const colors = { Superadmin: 'badge-red', Admin: 'badge-blue', Manager: 'badge-yellow', Staff: 'badge-gray' };
    return <span className={`badge ${colors[r] || 'badge-gray'}`}>{r}</span>;
  };

  return (
    <>
      <Head><title>Staff — Harene Diamonds Admin</title></Head>
      <AdminLayout title="Staff" subtitle={`${staff.length} staff members`}>
        <div className="page-header">
          <div>
            <h1>All Staff</h1>
            <p>Admin and staff accounts</p>
          </div>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>
            ➕ Add Staff Member
          </button>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} /></div>
        ) : staff.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🛡️</div><div>No staff found</div></div>
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
                {staff.map((s) => (
                  <tr key={s._id || s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {s.image
                          ? <img src={s.image} alt="" className="img-thumb" style={{ borderRadius: '50%' }} onError={(e) => e.target.style.display='none'} />
                          : <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                              {(s.name || 'S')[0].toUpperCase()}
                            </div>
                        }
                        <span className="td-primary">{s.name}</span>
                      </div>
                    </td>
                    <td className="text-muted">{s.email}</td>
                    <td>{s.phone || '—'}</td>
                    <td>{roleBadge(s.role)}</td>
                    <td><span className={`badge ${s.status === 'active' || s.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>{s.status}</span></td>
                    <td>
                      <button className="btn btn-sm" style={{ marginRight: 8 }} onClick={() => openEditModal(s)}>✏️ Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(s._id || s.id)}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-title">
                <span>{editId ? '✏️ Edit Staff' : '➕ Add Staff Member'}</span>
                <button className="btn btn-sm" onClick={() => { setShowAddModal(false); resetForm(); }}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-scroll">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-control" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input className="form-control" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Password {editId ? '(Leave blank to keep current)' : '*'}</label>
                  <input className="form-control" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required={!editId} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-control" placeholder="+91 99999 99999" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Superadmin">Superadmin</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Profile Image</label>
                  <div className="upload-box" style={{ position: 'relative' }}>
                    {uploadingImage ? (
                      <div className="spinner" />
                    ) : image ? (
                      <>
                        <img src={image} className="upload-preview" alt="preview" />
                        <button type="button" className="btn btn-sm btn-danger" style={{ position: 'absolute', top: 5, right: 5 }} onClick={() => setImage('')}>Remove</button>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div>📁 Click to upload image</div>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn" onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting || uploadingImage}>
                    {submitting ? <div className="spinner" /> : 'Save Staff'}
                  </button>
                </div>
              </form>
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
                Are you sure you want to delete this staff member? This action cannot be undone.
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
