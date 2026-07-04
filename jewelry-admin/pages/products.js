import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import * as XLSX from 'xlsx';
import Select, { components } from 'react-select';
import AdminLayout from '../components/AdminLayout';
import { apiFetch, API_BASE } from '../lib/api';

const IMPORT_TEMPLATE_HEADERS = [
  'Jewellery', 'Product', 'Poetic Name', 'Lot Number', 'Description',
  'Metal', 'Gross Gms', 'Photo', 'USD Price', 'Diamond Pcs', 'Shape',
  'Certificate', 'Cert.No',
];

const CustomMenuList = props => {
  return (
    <components.MenuList {...props}>
      {props.children}
      <div 
        style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', cursor: 'pointer', color: 'var(--brand)', fontWeight: 'bold', textAlign: 'center' }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (props.selectProps.onAddNew) props.selectProps.onAddNew();
        }}
      >
        + Add new {props.selectProps.addNewLabel || 'category'}
      </div>
    </components.MenuList>
  );
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  // Metadata states
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState(null); // null means adding, truthy ID means editing
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [productType, setProductType] = useState('jewelry');
  const [description, setDescription] = useState('');
  const [videoId, setVideoId] = useState('');
  const [status, setStatus] = useState('in-stock');
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [sizesInput, setSizesInput] = useState('');
  const [featured, setFeatured] = useState(false);
  const [poeticName, setPoeticName] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [metal, setMetal] = useState('');
  const [metalGms, setMetalGms] = useState('');
  const [diamondPcs, setDiamondPcs] = useState('');
  const [shape, setShape] = useState('');
  const [certificate, setCertificate] = useState('');
  const [certNo, setCertNo] = useState('');
  const [certPdf, setCertPdf] = useState('');
  const [uploadingCertPdf, setUploadingCertPdf] = useState(false);
  const [grossGms, setGrossGms] = useState('');
  const [usdPrice, setUsdPrice] = useState('');
  
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [showNewSub, setShowNewSub] = useState(false);
  const [newSubName, setNewSubName] = useState('');

  
  // Media states
  const [primaryImage, setPrimaryImage] = useState('');
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [photo1, setPhoto1] = useState('');
  const [photo2, setPhoto2] = useState('');
  const [photo3, setPhoto3] = useState('');
  const [photo4, setPhoto4] = useState('');
  const [uploadingP1, setUploadingP1] = useState(false);
  const [uploadingP2, setUploadingP2] = useState(false);
  const [uploadingP3, setUploadingP3] = useState(false);
  const [uploadingP4, setUploadingP4] = useState(false);
  
  const [video1, setVideo1] = useState('');
  const [video2, setVideo2] = useState('');
  const [uploadingV1, setUploadingV1] = useState(false);
  const [uploadingV2, setUploadingV2] = useState(false);

  const [uploadingMulti, setUploadingMulti] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Bulk import states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importBrandId, setImportBrandId] = useState('');
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { router.push('/'); return; }
    load();
    loadMetadata();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(products.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.productType || '').toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q)
    ));
  }, [search, products]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/product/all');
      const list = Array.isArray(data) ? data : (data?.result || data?.products || data?.data || []);
      setProducts(list);
      setFiltered(list);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadMetadata = async () => {
    try {
      const catsData = await apiFetch('/api/category/all');
      const catsList = Array.isArray(catsData) ? catsData : (catsData?.result || catsData?.categories || []);
      setCategories(catsList);

      const brandsData = await apiFetch('/api/brand/all');
      const brandsList = Array.isArray(brandsData) ? brandsData : (brandsData?.result || brandsData?.brands || []);
      setBrands(brandsList);
    } catch (e) { console.error('Failed to load categories/brands', e); }
  };

  
  const handleSlotUpload = async (e, setUrl, setUploading) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_BASE}/api/cloudinary/add-img`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.data?.url) setUrl(data.data.url);
      else alert('Upload failed: ' + (data.message || 'unknown error'));
    } catch (err) { alert('Upload error: ' + err.message); }
    finally { setUploading(false); }
  };

  const handlePrimaryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPrimary(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_BASE}/api/cloudinary/add-img`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        setPrimaryImage(data.data.url);
      } else {
        alert('Upload failed: ' + (data.message || 'unknown error'));
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploadingPrimary(false);
    }
  };

  const handleMultipleUploads = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploadingMulti(true);
    const uploadedUrls = [...additionalImages];
    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await fetch(`${API_BASE}/api/cloudinary/add-img`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.data?.url) {
          uploadedUrls.push(data.data.url);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setAdditionalImages(uploadedUrls);
    setUploadingMulti(false);
  };

  const removeAdditionalImage = (index) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  
  const handleAddNewCategory = async () => {
    if (!newCatName) return;
    try {
      const res = await apiFetch('/api/category/add', {
        method: 'POST',
        body: JSON.stringify({ parent: newCatName, children: [], productType: 'jewelry' })
      });
      await loadMetadata();
      const newId = res.data?.id || res.data?._id || res.result?.id;
      if (newId) setCategoryId(newId);
      setShowNewCategory(false);
      setNewCatName('');
    } catch (e) { alert(e.message); }
  };

  const handleAddNewSubCategory = () => {
    if (!newSubName) return;
    setSubCategory(newSubName);
    const cat = categories.find(c => (c.id || c._id) === categoryId);
    if (cat && !cat.children.includes(newSubName)) {
      cat.children.push(newSubName);
      setCategories([...categories]);
    }
    setShowNewSub(false);
    setNewSubName('');
  };

  const handleEditClick = (p) => {
    setTitle(p.title || '');
    setSku(p.sku || '');
    setUnit(p.unit || 'pcs');
    setPrice(p.price !== undefined && p.price !== null ? p.price.toString() : '');
    setDiscount(p.discount !== undefined && p.discount !== null ? p.discount.toString() : '');
    setQuantity(p.quantity !== undefined && p.quantity !== null ? p.quantity.toString() : '');
    setProductType(p.productType || 'jewelry');
    setDescription(p.description || '');
    setVideoId(p.videoId || '');
    setStatus(p.status || 'in-stock');
    setFeatured(p.featured || false);
    const getAdd = (key) => (p.additionalInformation || []).find(i => i.key === key)?.value || '';
    setPoeticName(getAdd('Poetic Name'));
    setLotNumber(getAdd('Lot Number'));
    setMetal(getAdd('Metal'));
    setMetalGms(getAdd('Metal gms'));
    setDiamondPcs(getAdd('Diamond Pcs'));
    setShape(getAdd('Shape'));
    setCertificate(getAdd('Certificate'));
    setCertNo(getAdd('Cert.No'));
    setCertPdf(getAdd('Cert PDF') || '');
    setGrossGms(getAdd('Gross Gms'));
    setUsdPrice(getAdd('USD Price'));

    
    // Find category ID matching name/parent
    const catName = p.parent || p.categoryName;
    const catObj = categories.find(c => c.parent === catName);
    setCategoryId(catObj ? (catObj.id || catObj._id) : '');
    setSubCategory(p.children || '');

    // Find brand ID matching name
    const brandObj = brands.find(b => b.name === p.brandName);
    setBrandId(brandObj ? (brandObj.id || brandObj._id) : '');

        setPhoto1(p.img || '');
    const addImgs = (p.imageURLs || []).map(i => i.img || i).filter(url => url !== p.img);
    setPhoto2(addImgs[0] || '');
    setPhoto3(addImgs[1] || '');
    setPhoto4(addImgs[2] || '');
    setVideo1(p.videoId || '');
    setVideo2(getAdd('Video 2'));


    setTagsInput((p.tags || []).join(', '));
    setSizesInput((p.sizes || []).join(', '));

    setEditId(p._id || p.id);
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isDiamond = productType === 'diamond';

    const finalTitle = isDiamond ? `${shape} Diamond - ${lotNumber}` : title;
    const finalSku = isDiamond ? lotNumber : sku;
    const finalPrice = isDiamond ? parseFloat(usdPrice || 0) : price;
    const finalQuantity = isDiamond ? 1 : quantity;
    const finalBrandId = isDiamond ? (brands[0]?.id || brands[0]?._id || '') : brandId;
    const finalCategoryId = isDiamond ? (categories[0]?.id || categories[0]?._id || '') : categoryId;
    const finalPoeticName = isDiamond ? '' : poeticName;
    const finalSubCategory = isDiamond ? '' : subCategory;

    if (isDiamond) {
      if (!lotNumber || !metal || !metalGms || !shape || !certificate || !certNo || !grossGms || !usdPrice || !photo1) {
        alert('Please fill out all required fields for Diamond.');
        return;
      }
    } else {
      if (!finalTitle || !finalSku || !finalPrice || !finalQuantity || !finalBrandId || !finalCategoryId || !photo1 || !finalPoeticName || !lotNumber || !metal || !metalGms || !shape || !certificate || !certNo || !grossGms || !usdPrice) {
        alert('Please fill out all required fields for Jewellery.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const selectedBrand = brands.find(b => (b.id || b._id) === finalBrandId);
      const selectedCategory = categories.find(c => (c.id || c._id) === finalCategoryId);

      const payload = {
        title: finalTitle,
        sku: finalSku,
        unit,
        price: parseFloat(finalPrice),
        discount: discount ? parseFloat(discount) : 0,
        quantity: parseInt(finalQuantity),
        productType,
        description,
        videoId: video1 || null,
        status,
        parent: selectedCategory ? selectedCategory.parent : '',
        children: finalSubCategory || '',
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        sizes: sizesInput.split(',').map(s => s.trim()).filter(Boolean),
        featured,
        additionalInformation: [
          { key: 'Jewellery', value: selectedCategory && !isDiamond ? selectedCategory.parent : '' },
          { key: 'Product', value: finalSubCategory || '' },
          { key: 'Poetic Name', value: finalPoeticName },
          { key: 'Lot Number', value: lotNumber },
          { key: 'Metal', value: metal },
          { key: 'Metal gms', value: metalGms },
          { key: 'Diamond Pcs', value: diamondPcs },
          { key: 'Shape', value: shape },
          { key: 'Certificate', value: certificate },
          { key: 'Cert.No', value: certNo },
          { key: 'Cert PDF', value: certPdf },
          { key: 'Gross Gms', value: grossGms },
          { key: 'USD Price', value: usdPrice },
          { key: 'Video 2', value: video2 },
        ].filter(i => i.value),

        img: photo1,
        imageURLs: [photo2, photo3, photo4].filter(Boolean).map(url => ({ color: {name:"", clrCode:""}, img: url })),
        brand: {
          id: selectedBrand ? (selectedBrand.id || selectedBrand._id) : '',
          name: selectedBrand ? selectedBrand.name : ''
        },
        category: {
          id: selectedCategory ? (selectedCategory.id || selectedCategory._id) : '',
          name: selectedCategory ? selectedCategory.parent : ''
        }
      };

      if (editId) {
        // Edit existing product
        await apiFetch(`/api/product/edit-product/${editId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
      } else {
        // Add new product
        await apiFetch('/api/product/add', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }

      setShowAddModal(false);
      resetForm();
      load();
    } catch (err) {
      alert(`Failed to ${editId ? 'update' : 'add'} product: ` + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const downloadTemplate = (type = 'jewelry') => {
    const isDiamond = type === 'diamond';
    const templateHeaders = isDiamond 
      ? [ 'Lot Number', 'Description', 'Metal', 'Metal gms', 'Diamond Pcs', 'Shape', 'Certificate', 'Cert.No', 'Gross Gms', 'Photo', 'USD Price' ]
      : IMPORT_TEMPLATE_HEADERS;

    const sampleRow = isDiamond 
      ? {
          'Lot Number': 'VNRNG101', 'Description': 'Round diamond ring', 'Metal': '18K', 'Metal gms': '2.5',
          'Diamond Pcs': '1', 'Shape': 'Round', 'Certificate': 'GIA', 'Cert.No': '1234567',
          'Gross Gms': '3.0', 'Photo': '(paste image here)', 'USD Price': '2150'
        }
      : {
          'Jewellery': 'Rings', 'Product': 'Aquamarine Ring', 'Poetic Name': 'Ocean Whisper',
          'Lot Number': 'VNRNG101', 'Description': '', 'Metal': '18K', 'Gross Gms': '5.51',
          'Photo': '(paste image here)', 'USD Price': '2150', 'Diamond Pcs': '40',
          'Shape': 'Round', 'Certificate': 'GIA', 'Cert.No': '1234567',
        };

    const ws = XLSX.utils.json_to_sheet([sampleRow], { header: templateHeaders });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, isDiamond ? 'Diamonds' : 'Products');
    XLSX.writeFile(wb, isDiamond ? 'diamond-import-template.xlsx' : 'product-import-template.xlsx');
  };

  const downloadCurrentData = () => {
    const rows = products.map(p => ({
      'Jewellery': p.parent || '',
      'Product': p.children || '',
      'Poetic Name': p.title || '',
      'Lot Number': p.sku || '',
      'Description': p.description || '',
      'Metal': '',
      'Gross Gms': '',
      'Photo': p.img || '',
      'USD Price': p.price ?? '',
      'Diamond Pcs': '',
      'Shape': '',
      'Certificate': '',
      'Cert.No': '',
      'Status': p.status || '',
      'Quantity': p.quantity ?? '',
      'Brand': p.brandName || '',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'All Products');
    XLSX.writeFile(wb, 'all-products.xlsx');
  };

  const handleBulkImport = async (e) => {
    e.preventDefault();
    if (!importFile || !importBrandId) {
      alert('Please select a brand and an Excel file');
      return;
    }
    setImporting(true);
    setImportResult(null);
    const formData = new FormData();
    formData.append('file', importFile);
    formData.append('brandId', importBrandId);
    try {
      const res = await fetch(`${API_BASE}/api/product/bulk-import-excel`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImportResult(data.data);
        load();
      } else {
        alert('Import failed: ' + (data.message || 'unknown error'));
      }
    } catch (err) {
      alert('Import error: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/api/product/${id}`, { method: 'DELETE' });
      setDeleteId(null);
      load();
    } catch (e) { alert('Delete failed: ' + e.message); }
  };

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setSku('');
    setUnit('pcs');
    setPrice('');
    setDiscount('');
    setQuantity('');
    setProductType('jewelry');
    setDescription('');
    setVideoId('');
    setStatus('in-stock');
    setBrandId('');
    setCategoryId('');
    setSubCategory('');
    setTagsInput('');
    setSizesInput('');
    setFeatured(false);
    setPhoto1('');
    setPhoto2('');
    setPhoto3('');
    setPhoto4('');
    setVideo1('');
    setVideo2('');

    setPoeticName('');
    setLotNumber('');
    setMetal('');
    setMetalGms('');
    setDiamondPcs('');
    setShape('');
    setCertificate('');
    setCertNo('');
    setCertPdf('');
    setGrossGms('');
    setUsdPrice('');
    setShowNewCategory(false);
    setShowNewSub(false);

    setPrimaryImage('');
    setAdditionalImages([]);
  };

  const statusBadge = (s) => {
    const map = { 'in-stock': 'badge-green', 'out-of-stock': 'badge-red', 'discontinued': 'badge-gray' };
    return <span className={`badge ${map[s] || 'badge-gray'}`}>{s}</span>;
  };

  // Get children/subcategories of the currently selected category
  const selectedCatObj = categories.find(c => (c.id || c._id) === categoryId);
  const subCategoryOptions = selectedCatObj ? (selectedCatObj.children || []) : [];

  return (
    <>
      <Head><title>Products — Harene Diamonds Admin</title></Head>
      <AdminLayout title="Products" subtitle={`${products.length} total products`}>

        <div className="page-header">
          <div>
            <h1>All Products</h1>
            <p>Manage your jewelry catalog</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => downloadTemplate('jewelry')}>
              ⬇️ Download Jewellery Template
            </button>
            <button className="btn" onClick={() => downloadTemplate('diamond')}>
              ⬇️ Download Diamond Template
            </button>
            <button className="btn" onClick={downloadCurrentData}>
              ⬇️ Export Current Data
            </button>
            <button className="btn" onClick={() => { setImportResult(null); setImportFile(null); setImportBrandId(''); setShowImportModal(true); }}>
              📊 Bulk Import (Excel)
            </button>
            <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>
              ➕ Add Product
            </button>
          </div>
        </div>

        <div className="search-bar">
          <span>🔍</span>
          <input
            placeholder="Search by name, type, or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="text-muted text-sm">{filtered.length} found</span>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💍</div>
            <div>No products found</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id || p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {p.img && (
                          <img
                            src={p.img}
                            alt=""
                            className="img-thumb"
                            onError={(e) => e.target.style.display='none'}
                          />
                        )}
                        <div>
                          <div className="td-primary" style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                          <div className="text-muted text-sm">{p.parent} {p.children ? `> ${p.children}` : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="td-mono">{p.sku}</span></td>
                    <td><span className="badge badge-blue">{p.productType}</span></td>
                    <td className="td-primary">${Number(p.price || 0).toLocaleString('en-US')}</td>
                    <td>{p.discount ? <span className="badge badge-yellow">{p.discount}% off</span> : '—'}</td>
                    <td>{p.quantity ?? '—'}</td>
                    <td>{statusBadge(p.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-sm" onClick={() => handleEditClick(p)}>✏️ Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(p._id || p.id)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Form Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal modal-lg">
              <div className="modal-title">
                <span>{editId ? '✏️ Edit Product' : '➕ Add New Product'}</span>
                <button className="btn btn-sm" onClick={() => { setShowAddModal(false); resetForm(); }}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-scroll">
                
                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Product Type</label>
                    <select className="form-control" value={productType} onChange={(e) => setProductType(e.target.value)}>
                      <option value="jewelry">Jewellery</option>
                      <option value="diamond">Diamond</option>
                    </select>
                  </div>
                </div>

                {productType !== 'diamond' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Product Title *</label>
                      <input className="form-control" placeholder="Diamond Engagement Ring" value={title} onChange={(e) => setTitle(e.target.value)} required={productType !== 'diamond'} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">SKU *</label>
                      <input className="form-control" placeholder="SKU-RING-01" value={sku} onChange={(e) => setSku(e.target.value)} required={productType !== 'diamond'} />
                    </div>
                  </div>
                )}

                {productType !== 'diamond' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Price (USD) *</label>
                      <input className="form-control" type="number" step="0.01" placeholder="45000" value={price} onChange={(e) => setPrice(e.target.value)} required={productType !== 'diamond'} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Discount (%)</label>
                      <input className="form-control" type="number" placeholder="5" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                    </div>
                  </div>
                )}

                {productType !== 'diamond' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Stock Quantity *</label>
                      <input className="form-control" type="number" placeholder="10" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} required={productType !== 'diamond'} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Unit</label>
                      <input className="form-control" placeholder="pcs" value={unit} onChange={(e) => setUnit(e.target.value)} />
                    </div>
                  </div>
                )}

                {productType !== 'diamond' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Category (Jewellery) *</label>
                      <Select 
                        options={Array.from(new Map(categories.map(c => [
                          ((c.parent || '').trim().toLowerCase().replace(/s$/, '').replace('pendent', 'pendant')), 
                          { value: c.id || c._id, label: c.parent }
                        ])).values())}
                        value={categories.filter(c => (c.id || c._id) === categoryId).map(c => ({ value: c.id || c._id, label: c.parent }))}
                        onChange={(opt) => { setCategoryId(opt?.value || ''); setSubCategory(''); }}
                        isClearable
                        placeholder="Select Category"
                        styles={{ control: (base) => ({ ...base, minHeight: '42px', borderColor: 'var(--border)' }) }}
                        components={{ MenuList: CustomMenuList }}
                        onAddNew={() => setShowNewCategory(true)}
                        addNewLabel="category"
                        required={productType !== 'diamond'}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Sub Category (Product) *</label>
                      <Select
                        options={Array.from(new Set(subCategoryOptions.map(sub => {
                          return sub;
                        }))).filter((v, i, a) => a.findIndex(t => t.trim().toLowerCase().replace(/s$/, '').replace('pendent', 'pendant') === v.trim().toLowerCase().replace(/s$/, '').replace('pendent', 'pendant')) === i).map(sub => ({ value: sub, label: sub }))}
                        value={subCategory ? { value: subCategory, label: subCategory } : null}
                        onChange={(opt) => setSubCategory(opt?.value || '')}
                        isClearable
                        placeholder="Select Subcategory"
                        styles={{ control: (base) => ({ ...base, minHeight: '42px', borderColor: 'var(--border)' }) }}
                        components={{ MenuList: CustomMenuList }}
                        onAddNew={() => setShowNewSub(true)}
                        addNewLabel="sub category"
                        required={productType !== 'diamond'}
                      />
                    </div>
                  </div>
                )}

                {productType !== 'diamond' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Poetic Name *</label>
                      <input className="form-control" placeholder="E.g. Midnight Star" value={poeticName} onChange={(e) => setPoeticName(e.target.value)} required={productType !== 'diamond'} />
                    </div>
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Lot Number *</label>
                    <input className="form-control" placeholder="E.g. LOT-1234" value={lotNumber} onChange={(e) => setLotNumber(e.target.value)} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Metal *</label>
                    <input className="form-control" placeholder="E.g. 18K Gold" value={metal} onChange={(e) => setMetal(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Metal gms *</label>
                    <input className="form-control" placeholder="E.g. 10.5" type="number" step="0.01" value={metalGms} onChange={(e) => setMetalGms(e.target.value)} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Diamond Pcs</label>
                    <input className="form-control" placeholder="E.g. 15" type="number" value={diamondPcs} onChange={(e) => setDiamondPcs(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Shape *</label>
                    <input className="form-control" placeholder="E.g. Round" value={shape} onChange={(e) => setShape(e.target.value)} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Certificate *</label>
                    <input className="form-control" placeholder="E.g. GIA" value={certificate} onChange={(e) => setCertificate(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cert.No *</label>
                    <input className="form-control" placeholder="E.g. GIA-123456" value={certNo} onChange={(e) => setCertNo(e.target.value)} required />
                  </div>
                </div>

                {/* Certificate PDF Upload */}
                <div className="form-row">
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Certificate PDF (Optional)</label>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Paste PDF URL or upload below"
                        value={certPdf}
                        onChange={e => setCertPdf(e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <label className="btn btn-secondary" style={{ cursor: 'pointer', marginBottom: 0 }}>
                        {uploadingCertPdf ? 'Uploading...' : '📎 Upload PDF'}
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          style={{ display: 'none' }}
                          disabled={uploadingCertPdf}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setUploadingCertPdf(true);
                            const fd = new FormData();
                            fd.append('image', file);
                            try {
                              const res = await fetch(`${API_BASE}/api/cloudinary/add-img`, { method: 'POST', body: fd });
                              const d = await res.json();
                              if (d.success && d.data?.url) setCertPdf(d.data.url);
                              else alert('PDF upload failed: ' + (d.message || 'unknown'));
                            } catch(err) { alert('Upload error: ' + err.message); }
                            finally { setUploadingCertPdf(false); }
                          }}
                        />
                      </label>
                      {certPdf && <a href={certPdf} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#c5a267' }}>View PDF ↗</a>}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Gross Gms *</label>
                    <input className="form-control" placeholder="E.g. 12.0" type="number" step="0.01" value={grossGms} onChange={(e) => setGrossGms(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">USD Price *</label>
                    <input className="form-control" placeholder="E.g. 500" type="number" step="0.01" value={usdPrice} onChange={(e) => setUsdPrice(e.target.value)} required />
                  </div>
                </div>

                {productType !== 'diamond' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Brand *</label>
                      <select className="form-control" value={brandId} onChange={(e) => setBrandId(e.target.value)} required={productType !== 'diamond'}>
                        <option value="">Select Brand</option>
                        {brands.map(b => (
                          <option key={b.id || b._id} value={b.id || b._id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="in-stock">In Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                  </div>
                  
                </div>

                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Poetic Name</label>
                    <input className="form-control" value={poeticName} onChange={e => setPoeticName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lot Number</label>
                    <input className="form-control" value={lotNumber} onChange={e => setLotNumber(e.target.value)} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Metal</label>
                    <input className="form-control" value={metal} onChange={e => setMetal(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Metal gms</label>
                    <input className="form-control" type="number" step="0.01" value={metalGms} onChange={e => setMetalGms(e.target.value)} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Diamond Pcs</label>
                    <input className="form-control" type="number" value={diamondPcs} onChange={e => setDiamondPcs(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Shape</label>
                    <input className="form-control" value={shape} onChange={e => setShape(e.target.value)} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Certificate</label>
                    <input className="form-control" value={certificate} onChange={e => setCertificate(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cert.No</label>
                    <input className="form-control" value={certNo} onChange={e => setCertNo(e.target.value)} />
                  </div>
                </div>

                {/* Certificate PDF Upload (Edit) */}
                <div className="form-row">
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Certificate PDF</label>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Paste PDF URL or upload below"
                        value={certPdf}
                        onChange={e => setCertPdf(e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <label className="btn btn-secondary" style={{ cursor: 'pointer', marginBottom: 0 }}>
                        {uploadingCertPdf ? 'Uploading...' : '📎 Upload PDF'}
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          style={{ display: 'none' }}
                          disabled={uploadingCertPdf}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setUploadingCertPdf(true);
                            const fd = new FormData();
                            fd.append('image', file);
                            try {
                              const res = await fetch(`${API_BASE}/api/cloudinary/add-img`, { method: 'POST', body: fd });
                              const d = await res.json();
                              if (d.success && d.data?.url) setCertPdf(d.data.url);
                              else alert('PDF upload failed: ' + (d.message || 'unknown'));
                            } catch(err) { alert('Upload error: ' + err.message); }
                            finally { setUploadingCertPdf(false); }
                          }}
                        />
                      </label>
                      {certPdf && <a href={certPdf} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#c5a267' }}>View PDF ↗</a>}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Gross Gms</label>
                    <input className="form-control" type="number" step="0.01" value={grossGms} onChange={e => setGrossGms(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">USD Price</label>
                    <input className="form-control" type="number" step="0.01" value={usdPrice} onChange={e => setUsdPrice(e.target.value)} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tags (Comma separated)</label>
                    <input className="form-control" placeholder="ring, diamond, gold, gift" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sizes (Comma separated)</label>
                    <input className="form-control" placeholder="6, 7, 8, 9" value={sizesInput} onChange={(e) => setSizesInput(e.target.value)} />
                  </div>
                </div>

                <div className="form-group checkbox-row">
                  <input type="checkbox" id="featured-checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                  <label htmlFor="featured-checkbox" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Feature this product on homepage</label>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Description</label>
                  <textarea className="form-control" rows={4} placeholder="Write a premium description for this jewelry item..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Video 1 (Upload or URL)</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input className="form-control" placeholder="URL or upload..." value={video1} onChange={e => setVideo1(e.target.value)} style={{ flex: 1 }} />
                      <label className="btn btn-sm" style={{ cursor: 'pointer', margin: 0, display: 'flex', alignItems: 'center' }}>
                        {uploadingV1 ? '...' : 'Upload'}
                        <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleSlotUpload(e, setVideo1, setUploadingV1)} />
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Video 2 (Upload or URL)</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input className="form-control" placeholder="URL or upload..." value={video2} onChange={e => setVideo2(e.target.value)} style={{ flex: 1 }} />
                      <label className="btn btn-sm" style={{ cursor: 'pointer', margin: 0, display: 'flex', alignItems: 'center' }}>
                        {uploadingV2 ? '...' : 'Upload'}
                        <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleSlotUpload(e, setVideo2, setUploadingV2)} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Photo 1 (Primary) *</label>
                    <div className="upload-box" style={{ position: 'relative' }}>
                      {uploadingP1 ? <div className="spinner" /> : photo1 ? (
                        <><img src={photo1} className="upload-preview" alt="P1" /><button type="button" className="btn btn-sm btn-danger" style={{ position: 'absolute', top: 5, right: 5 }} onClick={() => setPhoto1('')}>Remove</button></>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                          <div>📷 Upload</div>
                          <input type="file" accept="image/*" onChange={e => handleSlotUpload(e, setPhoto1, setUploadingP1)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Photo 2 (Optional)</label>
                    <div className="upload-box" style={{ position: 'relative' }}>
                      {uploadingP2 ? <div className="spinner" /> : photo2 ? (
                        <><img src={photo2} className="upload-preview" alt="P2" /><button type="button" className="btn btn-sm btn-danger" style={{ position: 'absolute', top: 5, right: 5 }} onClick={() => setPhoto2('')}>Remove</button></>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                          <div>📷 Upload</div>
                          <input type="file" accept="image/*" onChange={e => handleSlotUpload(e, setPhoto2, setUploadingP2)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Photo 3 (Optional)</label>
                    <div className="upload-box" style={{ position: 'relative' }}>
                      {uploadingP3 ? <div className="spinner" /> : photo3 ? (
                        <><img src={photo3} className="upload-preview" alt="P3" /><button type="button" className="btn btn-sm btn-danger" style={{ position: 'absolute', top: 5, right: 5 }} onClick={() => setPhoto3('')}>Remove</button></>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                          <div>📷 Upload</div>
                          <input type="file" accept="image/*" onChange={e => handleSlotUpload(e, setPhoto3, setUploadingP3)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Photo 4 (Optional)</label>
                    <div className="upload-box" style={{ position: 'relative' }}>
                      {uploadingP4 ? <div className="spinner" /> : photo4 ? (
                        <><img src={photo4} className="upload-preview" alt="P4" /><button type="button" className="btn btn-sm btn-danger" style={{ position: 'absolute', top: 5, right: 5 }} onClick={() => setPhoto4('')}>Remove</button></>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                          <div>📷 Upload</div>
                          <input type="file" accept="image/*" onChange={e => handleSlotUpload(e, setPhoto4, setUploadingP4)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn" onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting || uploadingP1 || uploadingP2 || uploadingP3 || uploadingP4 || uploadingV1 || uploadingV2}>
                    {submitting ? <div className="spinner" /> : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bulk Import Modal */}
        {showImportModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-title">
                <span>📊 Bulk Import Products (Excel)</span>
                <button className="btn btn-sm" onClick={() => setShowImportModal(false)}>✕</button>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                Upload a vendor Excel sheet (columns: Jewellery, Product, Poetic Name, Lot Number, Description, Metal,
                Gross Gms, Photo, USD Price, Diamond Pcs, Shape, Certificate, Cert.No). Embedded row images are
                extracted and matched by row automatically.
              </p>
              <form onSubmit={handleBulkImport}>
                <div className="form-group">
                  <label className="form-label">Brand *</label>
                  <select className="form-control" value={importBrandId} onChange={(e) => setImportBrandId(e.target.value)} required>
                    <option value="">Select Brand</option>
                    {brands.map(b => (
                      <option key={b.id || b._id} value={b.id || b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Excel File *</label>
                  <input type="file" className="form-control" accept=".xlsx,.xls" onChange={(e) => setImportFile(e.target.files[0])} required />
                </div>

                {importResult && (
                  <div style={{ fontSize: 13, marginTop: 10 }}>
                    <p>Rows processed: {importResult.totalRows} · Created: {importResult.created} · Updated: {importResult.updated}</p>
                    {importResult.errors?.length > 0 && (
                      <div style={{ color: 'var(--danger, #ef4444)' }}>
                        <p>Errors:</p>
                        <ul>
                          {importResult.errors.map((err, i) => (
                            <li key={i}>Row {err.row} ({err.sku}): {err.message}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn" onClick={() => setShowImportModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary" disabled={importing}>
                    {importing ? <div className="spinner" /> : 'Import'}
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
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="btn" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
              </div>
            </div>
          </div>
        )}

      </AdminLayout>

      {/* New Category Modal */}
      {showNewCategory && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal">
            <div className="modal-title">
              <span>➕ Add New Category</span>
              <button className="btn btn-sm" onClick={() => setShowNewCategory(false)}>✕</button>
            </div>
            <div style={{ marginTop: 15, marginBottom: 15 }}>
              <label className="form-label">Category Name</label>
              <input className="form-control" placeholder="E.g. Ring" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowNewCategory(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddNewCategory}>Add Category</button>
            </div>
          </div>
        </div>
      )}

      {/* New Sub Category Modal */}
      {showNewSub && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal">
            <div className="modal-title">
              <span>➕ Add New Sub Category</span>
              <button className="btn btn-sm" onClick={() => setShowNewSub(false)}>✕</button>
            </div>
            <div style={{ marginTop: 15, marginBottom: 15 }}>
              <label className="form-label">Sub Category Name</label>
              <input className="form-control" placeholder="E.g. Diamond Ring" value={newSubName} onChange={e => setNewSubName(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowNewSub(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddNewSubCategory}>Add Sub Category</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
