import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import AdminLayout from '../components/AdminLayout';
import { apiFetch } from '../lib/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TERMS_OPTIONS = ['NET 30', 'NET 60', 'NET 90', 'COD', '15 DAYS', '30 DAYS', '60 DAYS', '90 DAYS', 'DUE ON RECEIPT'];
const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'INR', 'AED', 'SGD'];
const ITEM_TYPE_OPTIONS = ['Jewelry', 'Diamond', 'Mixed', 'Loose Stone', 'Other'];
const STATUS_OPTIONS = ['Active', 'Draft', 'Closed'];
const SHAPE_OPTIONS = ['ROUND', 'OVAL', 'EMERALD', 'PRINCESS', 'RADIANT', 'MARQUISE', 'ASSCHER', 'CUSHION', 'HEART', 'MIX', 'PEAR'];
const COLOR_OPTIONS = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
const CLARITY_OPTIONS = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'];
const LAB_OPTIONS = ['GIA', 'IGI', 'HRD', 'GCAL', 'EGL', 'AGS', 'None'];

const EMPTY_LINE = {
  lotId: '', lotName: '', qty: '', weight: '', shape: '', color: '', clarity: '',
  labAc: '', certificateNo: '', list: '', dec: '', cutPct: '',
  docPriceGross: '', totalDocPriceGross: '', docDiscount: '', remark: '', cutList: '', lockDocPrice: false,
};

export default function MemosPage() {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('lines');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [editingMemoId, setEditingMemoId] = useState(null);
  const [editingSource, setEditingSource] = useState('memo');

  // row actions: edit-status modal, delete confirm, return-items modal
  const [editMemo, setEditMemo] = useState(null);
  const [deleteMemoId, setDeleteMemoId] = useState(null);
  const [returnMemo, setReturnMemo] = useState(null);
  const [returnLineIndexes, setReturnLineIndexes] = useState([]);

  // Header fields
  const [account, setAccount] = useState('');
  const [accountSearch, setAccountSearch] = useState('');
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [terms, setTerms] = useState('15 DAYS');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [currency, setCurrency] = useState('USD');
  const [itemType, setItemType] = useState('Jewelry');
  const [trackingNo, setTrackingNo] = useState('');
  const [ref1, setRef1] = useState('');
  const [details, setDetails] = useState('');
  const [remark1, setRemark1] = useState('');
  const [internalRemarks, setInternalRemarks] = useState('');
  const [signedByUser, setSignedByUser] = useState('');
  const [status, setStatus] = useState('Active');

  // Lines tab
  const [lines, setLines] = useState([{ ...EMPTY_LINE }]);
  const [selectedLines, setSelectedLines] = useState([]);
  const [lotNameToLoad, setLotNameToLoad] = useState('');

  useEffect(() => {
    load();
    loadClients();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [memoData, invoiceData] = await Promise.all([
        apiFetch('/api/memo/all').catch(() => ({ data: [] })),
        apiFetch('/api/invoice/all').catch(() => ({ data: [] }))
      ]);
      
      const realMemos = (memoData?.data || []).map((m) => ({ ...m, __source: 'memo' }));
      
      const unpaidStandaloneInvoices = (invoiceData?.data || [])
        .filter((inv) => inv.status !== 'paid' && !inv.memoId)
        .map((inv) => ({
          ...inv,
          memoNumber: inv.invoiceNumber,
          __source: 'invoice',
        }));
        
      setMemos([...realMemos, ...unpaidStandaloneInvoices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadClients = async () => {
    try {
      const data = await apiFetch('/api/client/all').catch(() => ({ data: [] }));
      setClients(data?.data || []);
    } catch (e) { console.error(e); }
  };

  const filteredClients = clients.filter(c =>
    c.name?.toLowerCase().includes(accountSearch.toLowerCase()) ||
    c.email?.toLowerCase().includes(accountSearch.toLowerCase())
  );

  const selectClient = (c) => {
    setAccount(c.id);
    setAccountSearch(c.name);
    setClientName(c.name || '');
    setClientAddress(c.address || '');
    setAccountDropdown(false);
  };

  // Line calculations
  const recalcLine = (line) => {
    const qty = Number(line.qty) || 0;
    const price = Number(line.docPriceGross) || 0;
    const disc = Number(line.docDiscount) || 0;
    const total = qty * price * (1 - disc / 100);
    return { ...line, totalDocPriceGross: total.toFixed(2) };
  };

  const updateLine = (idx, field, value) => {
    setLines(prev => {
      const updated = [...prev];
      updated[idx] = recalcLine({ ...updated[idx], [field]: value });
      return updated;
    });
  };

  const addLine = () => setLines(prev => [...prev, { ...EMPTY_LINE }]);

  const deleteLine = () => {
    setLines(prev => prev.filter((_, i) => !selectedLines.includes(i)));
    setSelectedLines([]);
  };

  const toggleLineSelect = (idx) => {
    setSelectedLines(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const grandTotal = lines.reduce((sum, l) => sum + (Number(l.totalDocPriceGross) || 0), 0);
  const totalQty = lines.reduce((sum, l) => sum + (Number(l.qty) || 0), 0);
  const totalWeight = lines.reduce((sum, l) => sum + (Number(l.weight) || 0), 0);

  const resetForm = () => {
    setAccount(''); setAccountSearch(''); setClientName(''); setClientAddress('');
    setTerms('15 DAYS'); setDate(new Date().toISOString().split('T')[0]);
    setCurrency('USD'); setItemType('Jewelry'); setTrackingNo('');
    setRef1(''); setDetails(''); setRemark1(''); setInternalRemarks('');
    setSignedByUser(''); setStatus('Active');
    setLines([{ ...EMPTY_LINE }]); setSelectedLines([]); setLotNameToLoad('');
    setActiveTab('lines');
    setEditingMemoId(null);
    setEditingSource('memo');
  };

  const handleEditMemo = (inv) => {
    // Populate form with memo data
    setAccount(inv.clientId || '');
    setAccountSearch(inv.client?.name || '');
    setClientName(inv.client?.name || '');
    setClientAddress(inv.client?.address || '');
    
    // Find header data from items if available
    const headerItem = Array.isArray(inv.items) ? inv.items.find(i => i.__header__) : null;
    
    setTerms(headerItem?.terms || '15 DAYS');
    setDate(headerItem?.date ? new Date(headerItem.date).toISOString().split('T')[0] : new Date(inv.createdAt).toISOString().split('T')[0]);
    setCurrency(headerItem?.currency || 'USD');
    setItemType(headerItem?.itemType || 'Jewelry');
    setTrackingNo(headerItem?.trackingNo || '');
    setRef1(headerItem?.ref1 || '');
    setDetails(headerItem?.details || '');
    setRemark1(headerItem?.remarks || '');
    setInternalRemarks(headerItem?.internalRemarks || '');
    setSignedByUser(headerItem?.signedByUser || '');
    setStatus(inv.status === 'paid' ? 'Active' : 'Draft'); // Just mapping roughly for the form status dropdown if they use it
    
    // Ensure lines is an array with at least one EMPTY_LINE
    const loadedLines = Array.isArray(inv.items) 
        ? inv.items.filter(i => !i.__header__).map(item => ({...item})) 
        : [];
    if (loadedLines.length === 0) loadedLines.push({ ...EMPTY_LINE });
    setLines(loadedLines);
    
    setEditingMemoId(inv.id || inv._id);
    setEditingSource(inv.__source || 'memo');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMemoStatus = async (inv, newStatus) => {
    try {
      const res = await apiFetch(`/api/memo/${inv.id}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
      if (res?.success) { setEditMemo(null); load(); }
    } catch (e) { alert('Error: ' + e.message); }
  };

  const handleDeleteMemo = async (id) => {
    try {
      const res = await apiFetch(`/api/memo/${id}`, { method: 'DELETE' });
      if (res?.success) { setDeleteMemoId(null); load(); }
    } catch (e) { alert('Error: ' + e.message); }
  };

  const handleReturnSubmit = async () => {
    if (returnLineIndexes.length === 0) { alert('Select at least one line to return'); return; }
    try {
      const res = await apiFetch(`/api/memo/${returnMemo.id}/return`, {
        method: 'PATCH',
        body: JSON.stringify({ returnedLineIndexes: returnLineIndexes }),
      });
      if (res?.success) { setReturnMemo(null); setReturnLineIndexes([]); load(); }
    } catch (e) { alert('Error: ' + e.message); }
  };

  const handleSave = async (andClose = false) => {
    setErrorMsg(''); setSuccessMsg('');
    const validLines = lines.filter(l => l.lotId || l.lotName || l.qty);
    if (validLines.length === 0) {
      setErrorMsg('Please add at least one line item.');
      return;
    }
    if (!account && !clientName) {
      setErrorMsg('Please select or enter an account/client.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        clientId: account || undefined,
        newClient: !account && clientName ? { name: clientName, address: clientAddress } : undefined,
        terms, date, currency, itemType, trackingNo,
        ref1, details, remarks: remark1, internalRemarks, signedByUser, status,
        lines: validLines,
        amount: grandTotal,
      };
      const url = editingMemoId 
        ? (editingSource === 'invoice' ? `/api/invoice/${editingMemoId}` : `/api/memo/${editingMemoId}`) 
        : '/api/memo/add';
      const method = editingMemoId ? 'PATCH' : 'POST';
      const res = await apiFetch(url, { method, body: JSON.stringify(payload) });
      if (res?.success) {
        setSuccessMsg(`Memo #${res.data?.memoNumber || ''} saved successfully!`);
        await load();
        if (andClose) { setShowForm(false); resetForm(); }
        else { resetForm(); }
      } else {
        setErrorMsg(res?.message || 'Failed to save memo.');
      }
    } catch (e) {
      setErrorMsg(e.message || 'Error saving memo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head><title>Memos — Harene Diamonds Admin</title></Head>
      <AdminLayout title="Memos" subtitle={`${memos.length} total memos`}>

        {/* Page Header */}
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Memos</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>Memos created directly or converted from memos</p>
          </div>
          <button
            onClick={() => { setShowForm(f => !f); setErrorMsg(''); setSuccessMsg(''); if (showForm) resetForm(); }}
            style={{
              background: showForm ? '#e2e8f0' : '#1e293b', color: showForm ? '#334155' : '#fff',
              border: 'none', borderRadius: 8, padding: '9px 20px',
              fontWeight: 600, fontSize: 13, cursor: 'pointer'
            }}
          >
            {showForm ? '✕ Cancel' : editingMemoId ? '✏️ Edit Memo' : '+ New Memo'}
          </button>
        </div>

        {/* ───── NEW / EDIT MEMO FORM ───── */}
        {showForm && (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 28,
            overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            width: '100%', boxSizing: 'border-box' }}>

            {/* Messages */}
            {successMsg && <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '10px 20px', fontWeight: 600, fontSize: 13, borderBottom: '1px solid #bbf7d0' }}>✅ {successMsg}</div>}
            {errorMsg && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 20px', fontWeight: 600, fontSize: 13, borderBottom: '1px solid #fecaca' }}>⚠️ {errorMsg}</div>}

            {/* ── Row 1: Account + Terms row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 10, padding: '12px 14px 8px', borderBottom: '1px solid #f1f5f9', alignItems: 'end' }}>
              {/* Account */}
              <div style={{ position: 'relative', gridColumn: '1/3' }}>
                <label style={labelStyle}>Account</label>
                <input
                  value={accountSearch}
                  onChange={e => { setAccountSearch(e.target.value); setAccountDropdown(true); setAccount(''); }}
                  onFocus={() => setAccountDropdown(true)}
                  onBlur={() => setTimeout(() => setAccountDropdown(false), 200)}
                  placeholder="Search account..."
                  style={inputStyle}
                />
                {accountDropdown && filteredClients.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, zIndex: 100, maxHeight: 180, overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {filteredClients.map(c => (
                      <div key={c.id} onMouseDown={() => selectClient(c)} style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 13, borderBottom: '1px solid #f1f5f9' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                      >
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div style={{ color: '#94a3b8', fontSize: 11 }}>{c.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Terms */}
              <div>
                <label style={labelStyle}>Terms</label>
                <select value={terms} onChange={e => setTerms(e.target.value)} style={selectStyle}>
                  {TERMS_OPTIONS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              {/* Date */}
              <div>
                <label style={labelStyle}>Date</label>
                <DatePicker 
                  className="form-control" 
                  selected={date ? new Date(date) : new Date()} 
                  onChange={(d) => setDate(d ? new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0] : '')}
                  dateFormat="dd-MM-yyyy"
                  wrapperClassName="datePickerWrapper"
                  customInput={<input style={inputStyle} />}
                />
              </div>
              {/* Currency */}
              <div>
                <label style={labelStyle}>Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)} style={selectStyle}>
                  {CURRENCY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              {/* Signed By User */}
              <div>
                <label style={labelStyle}>Signed By User</label>
                <input value={signedByUser} onChange={e => setSignedByUser(e.target.value)} placeholder="e.g. APS_Analysis" style={inputStyle} />
              </div>
            </div>

            {/* ── Row 2: Name + Item Type + Status ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 10, padding: '8px 14px', borderBottom: '1px solid #f1f5f9', alignItems: 'end' }}>
              <div style={{ gridColumn: '1/3' }}>
                <label style={labelStyle}>Name</label>
                <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client name" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Item Type</label>
                <select value={itemType} onChange={e => setItemType(e.target.value)} style={selectStyle}>
                  {ITEM_TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tracking #</label>
                <input value={trackingNo} onChange={e => setTrackingNo(e.target.value)} placeholder="Tracking number" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle}>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* ── Row 3: Address + Ref + Internal Remarks + Upload ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, padding: '8px 14px', borderBottom: '1px solid #f1f5f9', alignItems: 'start' }}>
              <div>
                <label style={labelStyle}>Address</label>
                <textarea value={clientAddress} onChange={e => setClientAddress(e.target.value)} rows={3} placeholder="Client address" style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <div style={{ marginBottom: 8 }}>
                  <label style={labelStyle}>Ref 1</label>
                  <input value={ref1} onChange={e => setRef1(e.target.value)} placeholder="Reference 1" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Details</label>
                  <input value={details} onChange={e => setDetails(e.target.value)} placeholder="Details" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Remark 1</label>
                  <input value={remark1} onChange={e => setRemark1(e.target.value)} placeholder="Remark" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Internal Remarks</label>
                <textarea value={internalRemarks} onChange={e => setInternalRemarks(e.target.value)} rows={5} placeholder="Internal remarks (not printed)" style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', borderRadius: 8, minHeight: 80, color: '#94a3b8', fontSize: 12, cursor: 'pointer', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 20 }}>📎</span>
                <span>Upload Doc</span>
              </div>
            </div>

            {/* ── Tabs ── */}
            <div style={{ borderBottom: '1px solid #e2e8f0', padding: '0 16px', display: 'flex', gap: 0 }}>
              {['lines', 'additional', 'brokers', 'paymentTerms', 'tax', 'linesPrintEdit', 'attachedFiles'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: '10px 16px', border: 'none', borderBottom: activeTab === tab ? '2px solid #1e293b' : '2px solid transparent',
                  background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: activeTab === tab ? 700 : 500,
                  color: activeTab === tab ? '#1e293b' : '#64748b', textTransform: 'capitalize'
                }}>
                  {tab === 'paymentTerms' ? 'Payment Terms' : tab === 'linesPrintEdit' ? 'Lines Print Edit' : tab === 'attachedFiles' ? 'Attached Files' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* ── Lines Tab ── */}
            {activeTab === 'lines' && (
              <div style={{ padding: '0 0 12px' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table style={{ minWidth: 1400, width: 'max-content', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={thStyle}><input type="checkbox" onChange={e => setSelectedLines(e.target.checked ? lines.map((_, i) => i) : [])} /></th>
                        <th style={thStyle}>#</th>
                        <th style={thStyle}>Lot ID</th>
                        <th style={thStyle}>Lot Name</th>
                        <th style={thStyle}>QTY</th>
                        <th style={thStyle}>Weight</th>
                        <th style={thStyle}>Shape</th>
                        <th style={thStyle}>Color</th>
                        <th style={thStyle}>Clarity</th>
                        <th style={thStyle}>Lab Ac.</th>
                        <th style={thStyle}>Certificate No</th>
                        <th style={thStyle}>List</th>
                        <th style={thStyle}>Dec</th>
                        <th style={thStyle}>Cut-%</th>
                        <th style={thStyle}>Doc Price Gross ({currency})</th>
                        <th style={thStyle}>Total Doc Price Gross ({currency})</th>
                        <th style={thStyle}>Doc Discount%</th>
                        <th style={thStyle}>Remark</th>
                        <th style={thStyle}>Cut List ({currency})</th>
                        <th style={thStyle}>Lock Doc Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: selectedLines.includes(idx) ? '#eff6ff' : '#fff' }}>
                          <td style={tdStyle}><input type="checkbox" checked={selectedLines.includes(idx)} onChange={() => toggleLineSelect(idx)} /></td>
                          <td style={{ ...tdStyle, color: '#94a3b8', fontWeight: 600 }}>{idx + 1}</td>
                          <td style={tdStyle}><input value={line.lotId} onChange={e => updateLine(idx, 'lotId', e.target.value)} style={lineInputStyle} placeholder="Lot ID" /></td>
                          <td style={tdStyle}><input value={line.lotName} onChange={e => updateLine(idx, 'lotName', e.target.value)} style={{ ...lineInputStyle, minWidth: 120 }} placeholder="Lot Name" /></td>
                          <td style={tdStyle}><input type="number" value={line.qty} onChange={e => updateLine(idx, 'qty', e.target.value)} style={{ ...lineInputStyle, width: 50 }} /></td>
                          <td style={tdStyle}><input type="number" value={line.weight} onChange={e => updateLine(idx, 'weight', e.target.value)} style={{ ...lineInputStyle, width: 60 }} /></td>
                          <td style={tdStyle}>
                            <select value={line.shape} onChange={e => updateLine(idx, 'shape', e.target.value)} style={{ ...lineInputStyle, minWidth: 80 }}>
                              <option value=""></option>
                              {SHAPE_OPTIONS.map(s => <option key={s}>{s}</option>)}
                            </select>
                          </td>
                          <td style={tdStyle}>
                            <select value={line.color} onChange={e => updateLine(idx, 'color', e.target.value)} style={{ ...lineInputStyle, width: 50 }}>
                              <option value=""></option>
                              {COLOR_OPTIONS.map(c => <option key={c}>{c}</option>)}
                            </select>
                          </td>
                          <td style={tdStyle}>
                            <select value={line.clarity} onChange={e => updateLine(idx, 'clarity', e.target.value)} style={{ ...lineInputStyle, width: 60 }}>
                              <option value=""></option>
                              {CLARITY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                            </select>
                          </td>
                          <td style={tdStyle}>
                            <select value={line.labAc} onChange={e => updateLine(idx, 'labAc', e.target.value)} style={{ ...lineInputStyle, width: 60 }}>
                              <option value=""></option>
                              {LAB_OPTIONS.map(l => <option key={l}>{l}</option>)}
                            </select>
                          </td>
                          <td style={tdStyle}><input value={line.certificateNo} onChange={e => updateLine(idx, 'certificateNo', e.target.value)} style={{ ...lineInputStyle, minWidth: 100 }} placeholder="Cert No" /></td>
                          <td style={tdStyle}><input type="number" value={line.list} onChange={e => updateLine(idx, 'list', e.target.value)} style={{ ...lineInputStyle, width: 60 }} /></td>
                          <td style={tdStyle}><input type="number" value={line.dec} onChange={e => updateLine(idx, 'dec', e.target.value)} style={{ ...lineInputStyle, width: 50 }} /></td>
                          <td style={tdStyle}><input type="number" value={line.cutPct} onChange={e => updateLine(idx, 'cutPct', e.target.value)} style={{ ...lineInputStyle, width: 50 }} /></td>
                          <td style={tdStyle}><input type="number" value={line.docPriceGross} onChange={e => updateLine(idx, 'docPriceGross', e.target.value)} style={{ ...lineInputStyle, width: 80 }} /></td>
                          <td style={{ ...tdStyle, fontWeight: 600, color: '#0f172a' }}>{Number(line.totalDocPriceGross || 0).toFixed(2)}</td>
                          <td style={tdStyle}><input type="number" value={line.docDiscount} onChange={e => updateLine(idx, 'docDiscount', e.target.value)} style={{ ...lineInputStyle, width: 50 }} placeholder="%" /></td>
                          <td style={tdStyle}><input value={line.remark} onChange={e => updateLine(idx, 'remark', e.target.value)} style={{ ...lineInputStyle, minWidth: 80 }} /></td>
                          <td style={tdStyle}><input type="number" value={line.cutList} onChange={e => updateLine(idx, 'cutList', e.target.value)} style={{ ...lineInputStyle, width: 60 }} /></td>
                          <td style={{ ...tdStyle, textAlign: 'center' }}><input type="checkbox" checked={!!line.lockDocPrice} onChange={e => updateLine(idx, 'lockDocPrice', e.target.checked)} /></td>
                        </tr>
                      ))}
                    </tbody>
                    {/* Totals row */}
                    <tfoot>
                      <tr style={{ background: '#f8fafc', fontWeight: 700, borderTop: '2px solid #e2e8f0', fontSize: 12 }}>
                        <td colSpan={4} style={{ padding: '8px 12px', color: '#64748b' }}>Totals</td>
                        <td style={{ padding: '8px 6px' }}>{totalQty}</td>
                        <td style={{ padding: '8px 6px' }}>{totalWeight.toFixed(2)}</td>
                        <td colSpan={9}></td>
                        <td style={{ padding: '8px 6px', color: '#1e293b' }}>{grandTotal.toFixed(2)}</td>
                        <td colSpan={4}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Bottom toolbar of Lines tab */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                  <button onClick={addLine} style={toolbarBtnStyle}>Add</button>
                  <button onClick={deleteLine} style={{ ...toolbarBtnStyle, background: selectedLines.length > 0 ? '#fef2f2' : '#f8fafc', color: selectedLines.length > 0 ? '#dc2626' : '#94a3b8' }}>Delete</button>
                  <button style={toolbarBtnStyle}>Import</button>
                  <button style={toolbarBtnStyle}>Barcode</button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
                    <input value={lotNameToLoad} onChange={e => setLotNameToLoad(e.target.value)} placeholder="LotName To Load" style={{ ...inputStyle, width: 160, padding: '5px 10px' }} />
                  </div>
                  <button style={toolbarBtnStyle}>Load Clts</button>
                  <button style={toolbarBtnStyle}>Show Clts</button>
                  <button style={toolbarBtnStyle}>Load Lines</button>
                  <div style={{ marginLeft: 'auto', fontWeight: 700, fontSize: 14, color: '#1e293b', background: '#f0fdf4', padding: '6px 18px', borderRadius: 6, border: '1px solid #bbf7d0' }}>
                    Total: {currency} {grandTotal.toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            {/* ── Additional Tab ── */}
            {activeTab === 'additional' && (
              <div style={{ padding: '0 0 8px' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table style={{ minWidth: 900, width: 'max-content', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        {['Is Manual','Type','%','Doc Value (USD)','Main Value (USD)','Sec Value (USD)','Dept','Remark','Profit Center'].map(h => (
                          <th key={h} style={thStyle}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 12 }}>No additional entries</td></tr>
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0' }}>
                        <td colSpan={3} style={{ padding: '6px 10px' }}></td>
                        {['0.00','0.20','0.20'].map((v,i) => (
                          <td key={i} style={{ padding: '6px 10px', fontWeight: 700, fontSize: 11 }}>{v}</td>
                        ))}
                        <td colSpan={3}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* ── Brokers Tab ── */}
            {activeTab === 'brokers' && (
              <div style={{ padding: '0 0 8px' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table style={{ minWidth: 900, width: 'max-content', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        {['isManual','Salesman Account ID','Broker %','Broker Doc Price (USD)','Total Broker Main (USD)','Remark','Calculate Broker From','Calc Mode','Salesman Group'].map(h => (
                          <th key={h} style={thStyle}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 12 }}>No brokers added</td></tr>
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0' }}>
                        <td colSpan={3} style={{ padding: '6px 10px' }}></td>
                        {['0.00','0.00'].map((v,i) => (
                          <td key={i} style={{ padding: '6px 10px', fontWeight: 700, fontSize: 11 }}>{v}</td>
                        ))}
                        <td colSpan={4}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* ── Payment Terms Tab ── */}
            {activeTab === 'paymentTerms' && (
              <div style={{ padding: '0 0 8px' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table style={{ minWidth: 800, width: 'max-content', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        {['Days','Date','%','Doc Value (USD)','Main Value (USD)','Sec Value (USD)','Description'].map(h => (
                          <th key={h} style={thStyle}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#eff6ff' }}>
                        <td style={tdStyle}><input type="number" defaultValue={15} style={{ ...lineInputStyle, width: 60 }} /></td>
                        <td style={tdStyle}>
                          <DatePicker 
                            selected={new Date(Date.now()+4*24*3600*1000)} 
                            onChange={() => {}} 
                            dateFormat="dd-MM-yyyy"
                            todayButton="Today"
                            customInput={<input style={{ ...lineInputStyle, width: 110 }} />}
                          />
                        </td>
                        <td style={tdStyle}><input type="number" defaultValue={100} style={{ ...lineInputStyle, width: 60 }} /></td>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>0.00</td>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>0.02</td>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>0.20</td>
                        <td style={tdStyle}><input defaultValue="" placeholder="Description" style={{ ...lineInputStyle, minWidth: 160 }} /></td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0' }}>
                        <td style={{ padding: '6px 10px', fontWeight: 700 }}>15</td>
                        <td></td>
                        <td></td>
                        {['0','0','0'].map((v,i) => (
                          <td key={i} style={{ padding: '6px 10px', fontWeight: 700, fontSize: 11 }}>{v}</td>
                        ))}
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* ── Tax Tab ── */}
            {activeTab === 'tax' && (
              <div style={{ padding: '0 0 8px' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table style={{ minWidth: 900, width: 'max-content', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        {['IsManual','Tax Type','Tax Description','Tax Percent','Tax Doc Value (USD)','Tax Main Value (USD)','Tax Sec Value (USD)','Tax Account ID','Profit Center'].map(h => (
                          <th key={h} style={thStyle}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 12 }}>No tax entries</td></tr>
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0' }}>
                        <td colSpan={4} style={{ padding: '6px 10px' }}></td>
                        {['0','0','0'].map((v,i) => (
                          <td key={i} style={{ padding: '6px 10px', fontWeight: 700, fontSize: 11 }}>{v}</td>
                        ))}
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* ── Lines Print Edit Tab ── */}
            {activeTab === 'linesPrintEdit' && (
              <div style={{ padding: '0 0 8px' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table style={{ minWidth: 2000, width: 'max-content', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        {[
                          'Doc Line','Item ID','Item','Lot Name','Lot ID','Quantity',
                          'Main Price (USD)','Total Main Price (USD)','Rate To Main',
                          'Doc Price (USD)','Doc Price Total (USD)',
                          'Broker 1','Broker 1 %','Broker 2','Broker 2 %',
                          'Certificate No','Certificate ID','Certificate Date','Certificate Type ID',
                          'Report No','Job No','Lab Comments','Print Comments',
                          'RShapeID','RItemID','RColorID','RClarityID','RQuantityID','Estimated Color'
                        ].map(h => <th key={h} style={thStyle}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {lines.filter(l => l.lotId || l.lotName || l.qty).length === 0 ? (
                        <tr><td colSpan={29} style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 12 }}>No lines added yet. Add lines in the Lines tab first.</td></tr>
                      ) : lines.map((line, idx) => line.lotId || line.lotName || line.qty ? (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={tdStyle}>{idx + 1}</td>
                          <td style={tdStyle}>{line.lotId || '—'}</td>
                          <td style={tdStyle}>{line.lotName || '—'}</td>
                          <td style={tdStyle}>{line.lotName || '—'}</td>
                          <td style={tdStyle}>{line.lotId || '—'}</td>
                          <td style={tdStyle}>{line.qty || 0}</td>
                          <td style={tdStyle}>{Number(line.docPriceGross || 0).toFixed(2)}</td>
                          <td style={tdStyle}>{Number(line.totalDocPriceGross || 0).toFixed(2)}</td>
                          <td style={tdStyle}>1.00</td>
                          <td style={tdStyle}>{Number(line.docPriceGross || 0).toFixed(2)}</td>
                          <td style={tdStyle}>{Number(line.totalDocPriceGross || 0).toFixed(2)}</td>
                          <td style={tdStyle}>—</td><td style={tdStyle}>0</td>
                          <td style={tdStyle}>—</td><td style={tdStyle}>0</td>
                          <td style={tdStyle}>{line.certificateNo || '—'}</td>
                          <td style={tdStyle}>—</td>
                          <td style={tdStyle}>—</td>
                          <td style={tdStyle}>—</td>
                          <td style={tdStyle}>—</td><td style={tdStyle}>—</td>
                          <td style={tdStyle}>—</td><td style={tdStyle}>—</td>
                          <td style={tdStyle}>{line.shape || '—'}</td>
                          <td style={tdStyle}>{line.lotId || '—'}</td>
                          <td style={tdStyle}>{line.color || '—'}</td>
                          <td style={tdStyle}>{line.clarity || '—'}</td>
                          <td style={tdStyle}>{line.qty || 0}</td>
                          <td style={tdStyle}>—</td>
                        </tr>
                      ) : null)}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0', fontWeight: 700, fontSize: 11 }}>
                        <td colSpan={5} style={{ padding: '6px 10px' }}>{lines.filter(l=>l.qty).reduce((s,l)=>s+(Number(l.qty)||0),0)}</td>
                        <td style={{ padding: '6px 10px' }}>{totalQty}</td>
                        <td style={{ padding: '6px 10px' }}>0.00</td>
                        <td style={{ padding: '6px 10px' }}>{grandTotal.toFixed(2)}</td>
                        <td colSpan={3} style={{ padding: '6px 10px' }}>0.00</td>
                        <td colSpan={18}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* ── Attached Files Tab ── */}
            {activeTab === 'attachedFiles' && (
              <div style={{ padding: '0 0 8px' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ ...thStyle, width: '35%' }}>File Directory</th>
                        <th style={{ ...thStyle, width: '15%' }}>Attach Date</th>
                        <th style={{ ...thStyle, width: '30%' }}>Remark</th>
                        <th style={{ ...thStyle, width: '20%' }}>Expiration Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8', fontSize: 12 }}>
                          No files attached. Use Upload Doc above to attach files.
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                        <td colSpan={4} style={{ padding: '6px 10px' }}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}



            {/* ── Bottom Action Bar ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '2px solid #e2e8f0', background: '#f8fafc', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  <span style={{ fontWeight: 600 }}>By User:</span>&nbsp;{signedByUser || '—'}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginLeft: 16 }}>
                  <span style={{ fontWeight: 600 }}>Exported On:</span>&nbsp;—
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setShowForm(false); resetForm(); setErrorMsg(''); setSuccessMsg(''); }} style={{ ...actionBtnStyle, background: '#f1f5f9', color: '#64748b' }}>Cancel</button>
                <button onClick={() => handleSave(false)} disabled={saving} style={{ ...actionBtnStyle, background: '#0f9d58', color: '#fff' }}>
                  {saving ? 'Saving…' : 'Save & Create Doc.'}
                </button>
                <button style={{ ...actionBtnStyle, background: '#e2e8f0', color: '#1e293b' }}>Save & Print</button>
                <button onClick={() => handleSave(true)} disabled={saving} style={{ ...actionBtnStyle, background: '#1e293b', color: '#fff' }}>
                  {saving ? 'Saving…' : 'Save & Close'}
                </button>
                <button onClick={() => handleSave(false)} disabled={saving} style={{ ...actionBtnStyle, background: '#3b82f6', color: '#fff' }}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ───── MEMO LIST ───── */}
        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} /></div>
        ) : memos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🧾</div>
            <div>No memos yet</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Memo #</th>
                  <th>Client</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {memos.map((inv) => {
                  const lineCount = Array.isArray(inv.items) ? inv.items.filter((i) => !i.__header__).length : 0;
                  return (
                    <tr key={inv.id}>
                      <td className="td-mono">#{inv.memoNumber}</td>
                      <td>
                        <div className="td-primary">{inv.client?.name}</div>
                        <div className="text-muted text-sm">{inv.client?.email || inv.client?.phone || ''}</div>
                      </td>
                      <td style={{ fontSize: 12, color: '#64748b' }}>{lineCount} line(s)</td>
                      <td className="td-primary">${Number(inv.amount).toLocaleString()}</td>
                      <td><span className={`badge ${inv.status === 'paid' ? 'badge-green' : 'badge-yellow'}`}>{inv.status === 'paid' ? 'Memo' : 'Memo'}</span></td>
                      <td className="text-muted text-sm">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-sm" onClick={() => handleEditMemo(inv)}>✏️ Edit</button>
                          <button className="btn btn-sm" onClick={() => setEditMemo(inv)}>🔄 Status</button>
                          <button className="btn btn-sm" disabled={lineCount === 0} onClick={() => { setReturnMemo(inv); setReturnLineIndexes([]); }}>↩️ Return</button>
                          <button className="btn btn-sm btn-danger" onClick={() => setDeleteMemoId(inv.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit status modal */}
        {editMemo && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-title">
                <span>✏️ Edit Memo #{editMemo.memoNumber}</span>
                <button className="btn btn-sm" onClick={() => setEditMemo(null)}>✕</button>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                <strong>Memo</strong> = paid & finalized. <strong>Memo</strong> = unpaid, items can still be returned.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn"
                  style={editMemo.status !== 'paid' ? { background: '#f59e0b', color: '#fff' } : undefined}
                  onClick={() => toggleMemoStatus(editMemo, 'unpaid')}
                >
                  📋 Memo (Unpaid)
                </button>
                <button
                  className="btn"
                  style={editMemo.status === 'paid' ? { background: '#16a34a', color: '#fff' } : undefined}
                  onClick={() => toggleMemoStatus(editMemo, 'paid')}
                >
                  🧾 Memo (Paid)
                </button>
              </div>
              <div className="modal-actions">
                <button className="btn" onClick={() => setEditMemo(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete confirm modal */}
        {deleteMemoId && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-title">
                <span>⚠️ Confirm Delete</span>
                <button className="btn btn-sm" onClick={() => setDeleteMemoId(null)}>✕</button>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                Delete this memo? If it came from a memo, the memo will reopen in the Memos list.
              </p>
              <div className="modal-actions">
                <button className="btn" onClick={() => setDeleteMemoId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDeleteMemo(deleteMemoId)}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Memo/Memo return modal */}
        {returnMemo && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-title">
                <span>↩️ Return Items — #{returnMemo.memoNumber}</span>
                <button className="btn btn-sm" onClick={() => setReturnMemo(null)}>✕</button>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Select the lines being returned. They'll be removed and the amount recalculated.</p>
              {returnMemo.items.filter((i) => !i.__header__).map((item, idx) => (
                <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <input
                    type="checkbox"
                    checked={returnLineIndexes.includes(idx)}
                    onChange={(e) => {
                      setReturnLineIndexes(e.target.checked
                        ? [...returnLineIndexes, idx]
                        : returnLineIndexes.filter((i) => i !== idx));
                    }}
                  />
                  <span>{item.lotName || item.lotId || `Line ${idx + 1}`} — qty {item.qty || 1} — ${item.docPriceGross || item.price || 0}</span>
                </label>
              ))}
              <div className="modal-actions">
                <button className="btn" onClick={() => setReturnMemo(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleReturnSubmit}>Confirm Return</button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}

// ── Style helpers ──
const labelStyle = { display: 'block', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 };
const inputStyle = { width: '100%', border: '1px solid #e2e8f0', borderRadius: 5, padding: '6px 10px', fontSize: 12, color: '#1e293b', background: '#fff', outline: 'none', boxSizing: 'border-box' };
const selectStyle = { ...inputStyle };
const lineInputStyle = { border: '1px solid #e2e8f0', borderRadius: 4, padding: '4px 6px', fontSize: 11, color: '#1e293b', background: '#fff', outline: 'none', width: '100%', minWidth: 50 };
const thStyle = { padding: '8px 6px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap', borderRight: '1px solid #f1f5f9' };
const tdStyle = { padding: '5px 6px', verticalAlign: 'middle', borderRight: '1px solid #f8fafc' };
const toolbarBtnStyle = { padding: '5px 12px', border: '1px solid #e2e8f0', borderRadius: 5, background: '#f8fafc', color: '#374151', fontSize: 12, cursor: 'pointer', fontWeight: 500 };
const actionBtnStyle = { padding: '8px 18px', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' };
