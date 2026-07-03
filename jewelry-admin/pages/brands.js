import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '../components/AdminLayout';
import { apiFetch, API_BASE } from '../lib/api';

export default function BrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('active');
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
      const data = await apiFetch('/api/brand/all');
      const list = Array.isArray(data) ? data : (data?.result || data?.brands || []);
      setBrands(list);
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
        setLogo(data.data.url);
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
    if (!name) {
      alert('Brand Name is required');
      return;
    }
    setSubmitting(true);
    try {
      const payload = { name, description, logo, email, website, location, status };
      if (editId) {
        await apiFetch(`/api/brand/edit/${editId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/api/brand/add', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setShowAddModal(false);
      resetForm();
      load();
    } catch (err) {
      alert('Failed to save brand: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/api/brand/delete/${id}`, { method: 'DELETE' });
      setDeleteId(null);
      load();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const openEditModal = (b) => {
    setEditId(b._id || b.id);
    setName(b.name || '');
    setDescription(b.description || '');
    setLogo(b.logo || '');
    setEmail(b.email || '');
    setWebsite(b.website || '');
    setLocation(b.location || '');
    setStatus(b.status || 'active');
    setShowAddModal(true);
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setDescription('');
    setLogo('');
    setEmail('');
    setWebsite('');
    setLocation('');
    setStatus('active');
  };

  return (
    <>
      <Head><title>Brands — Harene Diamonds Admin</title></Head>
      <AdminLayout title="Brands" subtitle={`${brands.length} brands`}>
        <div className="page-header">
          <div>
            <h1>All Brands</h1>
            <p>Manage product brands</p>
          </div>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>
            ➕ Add Brand
          </button>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} /></div>
        ) : brands.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏷️</div>
            <div>No brands found</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Email</th>
                  <th>Website</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((b) => (
                  <tr key={b._id || b.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {b.logo && <img src={b.logo} alt="" className="img-thumb" onError={(e) => e.target.style.display='none'} />}
                        <span className="td-primary">{b.name}</span>
                      </div>
                    </td>
                    <td className="text-muted">{b.email || '—'}</td>
                    <td>
                      {b.website ? (
                        <a href={b.website} target="_blank" rel="noreferrer" style={{ color: 'var(--brand)' }}>
                          {b.website}
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>{b.location || '—'}</td>
                    <td>
                      <span className={`badge ${b.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                        {b.status || 'active'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm" style={{ marginRight: 8 }} onClick={() => openEditModal(b)}>✏️ Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(b._id || b.id)}>🗑️ Delete</button>
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
                <span>{editId ? '✏️ Edit Brand' : '➕ Add Brand'}</span>
                <button className="btn btn-sm" onClick={() => { setShowAddModal(false); resetForm(); }}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-scroll">
                <div className="form-group">
                  <label className="form-label">Brand Name *</label>
                  <input className="form-control" placeholder="Pandora" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={3} placeholder="Write brand description..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-control" type="email" placeholder="brand@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Website URL</label>
                  <input className="form-control" placeholder="https://example.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input className="form-control" placeholder="New York, USA" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Brand Logo</label>
                  <div className="upload-box" style={{ position: 'relative' }}>
                    {uploadingImage ? (
                      <div className="spinner" />
                    ) : logo ? (
                      <>
                        <img src={logo} className="upload-preview" alt="preview" />
                        <button type="button" className="btn btn-sm btn-danger" style={{ position: 'absolute', top: 5, right: 5 }} onClick={() => setLogo('')}>Remove</button>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div>📁 Click to upload logo</div>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn" onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting || uploadingImage}>
                    {submitting ? <div className="spinner" /> : 'Save Brand'}
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
                Are you sure you want to delete this brand? This action cannot be undone.
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
