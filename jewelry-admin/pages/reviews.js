import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '../components/AdminLayout';
import { apiFetch } from '../lib/api';

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { router.push('/'); return; }
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/review/all').catch(() => apiFetch('/api/product/review-product'));
      const list = Array.isArray(data) ? data : (data?.reviews || data?.products || []);
      setReviews(list);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const stars = (n) => '⭐'.repeat(Math.min(Math.max(Number(n) || 0, 0), 5));

  return (
    <>
      <Head><title>Reviews — Harene Diamonds Admin</title></Head>
      <AdminLayout title="Reviews" subtitle={`${reviews.length} reviews`}>
        <div className="page-header">
          <div><h1>All Reviews</h1><p>Customer product reviews</p></div>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} /></div>
        ) : reviews.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">⭐</div><div>No reviews found</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Product ID</th>
                  <th>User ID</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r, i) => (
                  <tr key={r._id || r.id || i}>
                    <td><span style={{ fontSize: 14 }}>{stars(r.rating)}</span> <span className="text-muted text-sm">({r.rating}/5)</span></td>
                    <td style={{ maxWidth: 300 }}><span className="td-primary">{r.comment || '—'}</span></td>
                    <td><span className="td-mono text-muted">{(r.productId || r.product || '—').toString().slice(0, 16)}…</span></td>
                    <td><span className="td-mono text-muted">{(r.userId || r.user || '—').toString().slice(0, 16)}…</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
