import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '../components/AdminLayout';
import { apiFetch, API_BASE } from '../lib/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [minimumAmount, setMinimumAmount] = useState('');
  const [endTime, setEndTime] = useState('');
  const [productType, setProductType] = useState('jewelry');
  const [logo, setLogo] = useState('');
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
      const data = await apiFetch('/api/coupon');
      const list = Array.isArray(data) ? data : (data?.coupons || []);
      setCoupons(list);
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
    if (!title || !couponCode || !discountPercentage || !minimumAmount || !endTime || !logo) {
      alert('All fields, including Logo Image, are required');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title,
        couponCode,
        discountPercentage: parseFloat(discountPercentage),
        minimumAmount: parseFloat(minimumAmount),
        endTime: new Date(endTime).toISOString(),
        productType,
        logo,
        status,
      };

      if (editId) {
        await apiFetch(`/api/coupon/${editId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/api/coupon/add', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setShowAddModal(false);
      resetForm();
      load();
    } catch (err) {
      alert('Failed to add coupon: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/api/coupon/${id}`, { method: 'DELETE' });
      setDeleteId(null);
      load();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const openEditModal = (c) => {
    setEditId(c._id || c.id);
    setTitle(c.title || '');
    setCouponCode(c.couponCode || '');
    setDiscountPercentage(c.discountPercentage || '');
    setMinimumAmount(c.minimumAmount || '');
    setEndTime(c.endTime ? new Date(c.endTime).toISOString().split('T')[0] : '');
    setProductType(c.productType || 'jewelry');
    setLogo(c.logo || '');
    setStatus(c.status || 'active');
    setShowAddModal(true);
  };

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setCouponCode('');
    setDiscountPercentage('');
    setMinimumAmount('');
    setEndTime('');
    setProductType('jewelry');
    setLogo('');
    setStatus('active');
  };

  const isExpired = (expDate) => new Date(expDate) < new Date();

  return (
    <>
      <Head><title>Coupons — Harene Diamonds Admin</title></Head>
      <AdminLayout title="Coupons" subtitle={`${coupons.length} coupons`}>
        <div className="page-header">
          <div>
            <h1>All Coupons</h1>
            <p>Manage discount coupons</p>
          </div>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>
            ➕ Add Coupon
          </button>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} /></div>
        ) : coupons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎟️</div>
            <div>No coupons found</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Min. Amount</th>
                  <th>Product Type</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id || c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {c.logo && <img src={c.logo} alt="" className="img-thumb" onError={(e) => e.target.style.display='none'} />}
                        <span className="td-primary">{c.title}</span>
                      </div>
                    </td>
                    <td>
                      <code style={{ background: 'var(--bg-hover)', padding: '4px 8px', borderRadius: 4, fontSize: 12, color: 'var(--brand)' }}>
                        {c.couponCode}
                      </code>
                    </td>
                    <td><span className="badge badge-green">{c.discountPercentage}% off</span></td>
                    <td>₹{Number(c.minimumAmount || 0).toLocaleString('en-IN')}</td>
                    <td><span className="badge badge-blue">{c.productType}</span></td>
                    <td className="text-muted text-sm">{c.endTime ? new Date(c.endTime).toLocaleDateString('en-IN') : '—'}</td>
                    <td>
                      {isExpired(c.endTime) ? (
                        <span className="badge badge-red">Expired</span>
                      ) : (
                        <span className={`badge ${c.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                          {c.status || 'Active'}
                        </span>
                      )}
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
                <span>{editId ? '✏️ Edit Coupon' : '➕ Add Coupon'}</span>
                <button className="btn btn-sm" onClick={() => { setShowAddModal(false); resetForm(); }}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-scroll">
                <div className="form-group">
                  <label className="form-label">Coupon Title *</label>
                  <input className="form-control" placeholder="Summer Sale" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Coupon Code *</label>
                  <input className="form-control" placeholder="SUMMER50" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Discount (%) *</label>
                    <input className="form-control" type="number" placeholder="15" min="1" max="100" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Min Purchase Amount *</label>
                    <input className="form-control" type="number" placeholder="500" min="0" value={minimumAmount} onChange={(e) => setMinimumAmount(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Expiry Date *</label>
                  <DatePicker 
                    className="form-control"
                    selected={endTime ? new Date(endTime) : null}
                    onChange={(d) => setEndTime(d ? new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0] : '')}
                    dateFormat="dd-MM-yyyy"
                  />
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Coupon Banner/Logo *</label>
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
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} required />
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn" onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting || uploadingImage}>
                    {submitting ? <div className="spinner" /> : 'Save Coupon'}
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
                Are you sure you want to delete this coupon? This action cannot be undone.
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
