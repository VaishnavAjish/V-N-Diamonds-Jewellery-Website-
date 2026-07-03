import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAV = [
  {
    section: 'Main',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: '📊' },
      { href: '/storefront', label: 'Storefront', icon: '🏪' },
    ],
  },
  {
    section: 'Catalog',
    items: [
      { href: '/products', label: 'Products', icon: '💍' },
      { href: '/categories', label: 'Categories', icon: '🗂️' },
      { href: '/brands', label: 'Brands', icon: '🏷️' },
      { href: '/coupons', label: 'Coupons', icon: '🎟️' },
    ],
  },
  {
    section: 'Sales',
    items: [
      { href: '/orders', label: 'Orders', icon: '📦' },
      { href: '/memos', label: 'Memos', icon: '📋' },
      { href: '/invoices', label: 'Invoices', icon: '🧾' },
      { href: '/reviews', label: 'Reviews', icon: '⭐' },
    ],
  },
  {
    section: 'People',
    items: [
      { href: '/users', label: 'Customers', icon: '👥' },
      { href: '/staff', label: 'Staff', icon: '🛡️' },
    ],
  },

];

export default function Sidebar({ user }) {
  const router = useRouter();
  const path = router.pathname;

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
    router.push('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" style={{ textAlign: 'center', padding: '20px 10px' }}>
        <img src="/harene-logo.png" alt="Harene Diamonds" style={{ maxWidth: '180px', height: 'auto' }} />
      </div>

      <nav className="sidebar-nav">
        {NAV.map((section) => (
          <div key={section.section}>
            <div className="nav-section-label">{section.section}</div>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${path.startsWith(item.href) ? 'active' : ''}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer', color: '#ef4444' }}>
          <span>🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
}
