import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '../components/AdminLayout';
import { apiFetch } from '../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Dashboard() {
  const router = useRouter();
  
  const [stats, setStats] = useState({ 
    products: 0, 
    orders: 0, 
    users: 0, 
    revenue: 0,
    memos: 0 // Placeholder as discussed
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/'); return; }
    loadData();
  }, []);

  const [salesData, setSalesData] = useState([]);

  const loadData = async () => {
    try {
      const [products, orders, users, invoicesRes] = await Promise.all([
        apiFetch('/api/product/all').catch(() => []),
        apiFetch('/api/order/orders').catch(() => []),
        apiFetch('/api/user/all').catch(() => []),
        apiFetch('/api/invoice/all').catch(() => ({ data: [] })),
      ]);

      const prodList = Array.isArray(products) ? products : (products?.data || products?.products || []);
      const orderList = Array.isArray(orders) ? orders : (orders?.data || orders?.orders || []);
      const userList = Array.isArray(users) ? users : (users?.data || users?.users || []);
      const invoiceList = invoicesRes?.data || [];

      const revenue = orderList.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

      setStats({
        products: prodList.length,
        orders: invoiceList.length,
        users: userList.length,
        revenue: invoiceList.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0),
        memos: 0
      });

      // Sort by amount to get top clients logic
      const topClients = [...invoiceList].sort((a,b) => (b.amount || 0) - (a.amount || 0)).slice(0, 5);
      setRecentOrders(topClients);
      setTopProducts(prodList.slice(0, 5));

      // Build monthly chart data from real invoices (last 12 months)
      const now = new Date();
      const monthMap = {};
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleString('en-US', { month: 'short' });
        monthMap[`${d.getFullYear()}-${d.getMonth()}`] = { name: key, invoice: 0, memo: 0 };
      }
      invoiceList.forEach(inv => {
        const d = new Date(inv.createdAt);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (monthMap[key]) {
          monthMap[key].invoice += Number(inv.amount) || 0;
        }
      });
      setSalesData(Object.values(monthMap));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <Head><title>Sales Analysis Dashboard — Harene Diamonds Admin</title></Head>
      <AdminLayout title="" subtitle="">
        <div className="sales-dashboard">
          
          <div className="header">
            <h1 className="header-title">Sales Analysis Dashboard</h1>
            <div className="header-subtitle">Updated: {currentDate}, {currentTime} - {stats.orders} records loaded</div>
          </div>

          {/* Layer 1: Top Metric Cards */}
          <div className="top-metric-cards">
            <div className="top-card top-card-blue">
              <div>
                <div className="top-card-title">${stats.revenue.toLocaleString()}</div>
                <div className="top-card-subtitle">This Month Sales</div>
                <div className="top-card-desc">+0% vs last month</div>
              </div>
            </div>
            <div className="top-card top-card-dark">
              <div>
                <div className="top-card-title">{stats.orders}</div>
                <div className="top-card-subtitle">Invoices This Month</div>
                <div className="top-card-desc">Total: {stats.orders} Invoices</div>
              </div>
            </div>
            <div className="top-card top-card-orange">
              <div>
                <div className="top-card-title">{stats.memos}</div>
                <div className="top-card-subtitle">Memos This Month</div>
                <div className="top-card-desc">Total: {stats.memos} Memos</div>
              </div>
            </div>
          </div>

          {/* Layer 2: Small Stat Cards */}
          <div className="small-stat-cards">
            <div className="small-card">
              <div className="small-card-content">
                <span className="small-card-label">Total Sales</span>
                <span className="small-card-value">${stats.revenue.toLocaleString()}</span>
                <span className="small-card-desc">All time</span>
              </div>
              <div className="small-card-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>💰</div>
            </div>
            <div className="small-card">
              <div className="small-card-content">
                <span className="small-card-label">Total Invoices</span>
                <span className="small-card-value">{stats.orders}</span>
                <span className="small-card-desc">Records</span>
              </div>
              <div className="small-card-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>📄</div>
            </div>
            <div className="small-card">
              <div className="small-card-content">
                <span className="small-card-label">Total Memos</span>
                <span className="small-card-value">{stats.memos}</span>
                <span className="small-card-desc">Records</span>
              </div>
              <div className="small-card-icon" style={{ background: '#ffedd5', color: '#ea580c' }}>📋</div>
            </div>
            <div className="small-card">
              <div className="small-card-content">
                <span className="small-card-label">Active Clients</span>
                <span className="small-card-value">{stats.users}</span>
                <span className="small-card-desc">Unique clients</span>
              </div>
              <div className="small-card-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}>👥</div>
            </div>
          </div>

          {/* Layer 3: Charts */}
          <div className="chart-row">
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">Monthly Sales Trend</div>
                <div className="chart-subtitle">Invoice & Memo amounts - last 12 months</div>
              </div>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="invoice" stroke="#3b82f6" strokeWidth={2} dot={false} name="Invoice" />
                    <Line type="monotone" dataKey="memo" stroke="#f97316" strokeWidth={2} dot={false} name="Memo" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">Category Breakdown</div>
                <div className="chart-subtitle">Jewelry vs Diamond</div>
              </div>
              <div style={{ padding: '20px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>Jewelry</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>$0</span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 20 }}>0 records</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>Diamond</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>$0</span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>0 records</div>
              </div>
            </div>
          </div>

          {/* Layer 4: Lower Charts & Lists */}
          <div className="chart-row">
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">Monthly Transaction Count</div>
                <div className="chart-subtitle">Invoice & Memo count per month</div>
              </div>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <RechartsTooltip />
                    <Bar dataKey="invoice" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Invoice" />
                    <Bar dataKey="memo" fill="#f97316" radius={[2, 2, 0, 0]} name="Memo" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">Top Clients by Sales</div>
                <div className="chart-subtitle">Ranked by total amount</div>
              </div>
              <div>
                {recentOrders.length === 0 ? (
                   <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 13 }}>No orders yet</div>
                ) : (
                  recentOrders.map((client, i) => (
                    <div key={i} className="client-list-item">
                      <div className="client-name">{client.name || client.email || 'Guest User'}</div>
                      <div className="client-amount">${(Number(client.totalAmount) || 0).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Layer 5: Bottom KPI Cards */}
          <div className="bottom-kpi-cards">
            <div className="kpi-card">
              <div className="kpi-card-label">YTD SALES</div>
              <div className="kpi-card-value">${stats.revenue.toLocaleString()}</div>
              <div className="kpi-progress-bar"><div className="kpi-progress-fill" style={{ width: '50%' }}></div></div>
              <div className="kpi-legend"><span>Jewelry</span><span>Diamond</span></div>
            </div>
            
            <div className="kpi-card kpi-card-orange">
              <div className="kpi-card-label">INVOICE VS MEMO SPLIT</div>
              <div className="kpi-card-value">{stats.orders + stats.memos} <span style={{fontSize: 14, fontWeight: 400}}>Total Transactions</span></div>
              <div style={{ fontSize: 13, marginTop: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>Invoices</span><span>{stats.orders}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Memos</span><span>{stats.memos}</span>
                </div>
              </div>
            </div>
            
            <div className="kpi-card">
              <div className="kpi-card-label">DIAMOND SALES</div>
              <div className="kpi-card-value">$0</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 'auto' }}>0 records</div>
              <div className="kpi-progress-bar" style={{ marginTop: 15 }}><div className="kpi-progress-fill" style={{ width: '10%' }}></div></div>
            </div>
            
            <div className="kpi-card">
              <div className="kpi-card-label">JEWELRY SALES</div>
              <div className="kpi-card-value">$0</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 'auto' }}>0 records</div>
              <div className="kpi-progress-bar" style={{ marginTop: 15 }}><div className="kpi-progress-fill" style={{ width: '10%' }}></div></div>
            </div>
          </div>

        </div>
      </AdminLayout>
    </>
  );
}
