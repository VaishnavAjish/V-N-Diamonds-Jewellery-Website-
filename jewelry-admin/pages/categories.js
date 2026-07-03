import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '../components/AdminLayout';
import { apiFetch, API_BASE } from '../lib/api';

export default function CategoriesPage() {
  const router = useRouter();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [parent, setParent] = useState('');
  const [childrenInput, setChildrenInput] = useState('');
  const [productType, setProductType] = useState('jewelry');
  const [status, setStatus] = useState('Show');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
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
      const data = await apiFetch('/api/category/all');
      const list = Array.isArray(data) ? data : (data?.result || data?.categories || []);
      setCats(list);
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
        setImg(data.data.url);
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
    if (!parent) {
      alert('Category Name (Parent) is required');
      return;
    }
    setSubmitting(true);
    try {
      const children = childrenInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = { parent, children, productType, status, description, img };
      if (editId) {
        await apiFetch(`/api/category/edit/${editId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/api/category/add', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setShowAddModal(false);
      resetForm();
      load();
    } catch (err) {
      alert('Failed to save category: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/api/category/delete/${id}`, { method: 'DELETE' });
      setDeleteId(null);
      load();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const openEditModal = (c) => {
    setEditId(c._id || c.id);
    setParent(c.parent || '');
    setChildrenInput((c.children || []).join(', '));
    setProductType(c.productType || 'jewelry');
    setStatus(c.status || 'Show');
    setDescription(c.description || '');
    setImg(c.img || '');
    setShowAddModal(true);
  };

  const resetForm = () => {
    setEditId(null);
    setParent('');
    setChildrenInput('');
    setProductType('jewelry');
    setStatus('Show');
    setDescription('');
    setImg('');
  };

  const typeBadge = (t) => {
    const colors = { jewelry: 'badge-blue', electronics: 'badge-yellow', fashion: 'badge-green', beauty: 'badge-red' };
    return <span className={`badge ${colors[t] || 'badge-gray'}`}>{t}</span>;
  };

  return (
    <>
      <Head><title>Categories — Harene Diamonds Admin</title></Head>
      <AdminLayout title="Categories" subtitle={`${cats.length} categories`}>
        <div className="page-header">
          <div>
            <h1>All Categories</h1>
            <p>Browse product categories</p>
          </div>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>
            ➕ Add Category
          </button>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} /></div>
        ) : cats.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🗂️</div>
            <div>No categories found</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Sub-categories</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cats.map((c) => (
                  <tr key={c._id || c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {c.img && <img src={c.img} alt="" className="img-thumb" onError={(e) => e.target.style.display='none'} />}
                        <span className="td-primary">{c.parent}</span>
                      </div>
                    </td>
                    <td>{typeBadge(c.productType)}</td>
                    <td className="text-muted">{(c.children || []).join(', ') || '—'}</td>
                    <td>
                      <span className={`badge ${c.status === 'Show' ? 'badge-green' : 'badge-gray'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm" style={{ marginRight: 8 }} onClick={() => openEditModal(c)}>✏️ Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(c._id || c.id)}>🗑️ Delete</button>
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
                <span>{editId ? '✏️ Edit Category' : '➕ Add Category'}</span>
                <button className="btn btn-sm" onClick={() => { setShowAddModal(false); resetForm(); }}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-scroll">
                <div className="form-group">
                  <label className="form-label">Category Name (Parent) *</label>
                  <input className="form-control" placeholder="Rings" value={parent} onChange={(e) => setParent(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Sub-categories (Comma separated)</label>
                  <input className="form-control" placeholder="Gold Rings, Silver Rings, Diamond Rings" value={childrenInput} onChange={(e) => setChildrenInput(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Product Type</label>
                  <select className="form-control" value={productType} onChange={(e) => setProductType(e.target.value)}>
                    <option value="jewelry">Jewelry</option>
                    <option value="fashion">Fashion</option>
                    <option value="electronics">Electronics</option>
                    <option value="beauty">Beauty</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Show">Show</option>
                    <option value="Hide">Hide</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={3} placeholder="Write category description..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category Image</label>
                  <div className="upload-box" style={{ position: 'relative' }}>
                    {uploadingImage ? (
                      <div className="spinner" />
                    ) : img ? (
                      <>
                        <img src={img} className="upload-preview" alt="preview" />
                        <button type="button" className="btn btn-sm btn-danger" style={{ position: 'absolute', top: 5, right: 5 }} onClick={() => setImg('')}>Remove</button>
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
                    {submitting ? <div className="spinner" /> : 'Save Category'}
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
                Are you sure you want to delete this category? This action cannot be undone.
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
