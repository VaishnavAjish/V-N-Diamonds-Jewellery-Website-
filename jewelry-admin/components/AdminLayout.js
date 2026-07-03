import Sidebar from './Sidebar';

export default function AdminLayout({ children, title, subtitle }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div>
            <div className="topbar-title">{title}</div>
            {subtitle && <div className="topbar-sub">{subtitle}</div>}
          </div>
          <div className="topbar-right">
            <div className="topbar-avatar">SA</div>
          </div>
        </header>
        <main className="page animate-in">
          {children}
        </main>
      </div>
    </div>
  );
}
