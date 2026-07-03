import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { apiFetch } from '../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_info', JSON.stringify(data.admin || data));
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login — Harene Diamonds</title>
      </Head>
      <div className="login-page">
        {/* Background orbs */}
        <div className="login-bg-orb" style={{ background: '#6c63ff', top: '-100px', left: '-100px' }} />
        <div className="login-bg-orb" style={{ background: '#ff6584', bottom: '-100px', right: '-100px' }} />

        <div className="login-card">
          <div className="login-logo" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src="/harene-logo.png" alt="Harene Diamonds" style={{ maxWidth: '200px', height: 'auto' }} />
          </div>
          <div className="login-sub">Jewelry Admin Dashboard</div>

          <h2 className="login-title" style={{ marginBottom: 20 }}>Welcome back 👋</h2>

          {error && <div className="error-msg">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="superadmin@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <><span className="spinner" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: '12px', background: 'rgba(108,99,255,0.08)', borderRadius: 8, border: '1px solid rgba(108,99,255,0.2)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>DEFAULT CREDENTIALS</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>📧 superadmin@gmail.com</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>🔑 Superadmin@2026</div>
          </div>
        </div>
      </div>
    </>
  );
}
