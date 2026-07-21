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
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
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
  
  // New Complex Form States
  const [availableForMemo, setAvailableForMemo] = useState(false);
  const [condition, setCondition] = useState('');
  const [jewelryQuality, setJewelryQuality] = useState('');
  const [designerMaker, setDesignerMaker] = useState('');
  const [freeShipping, setFreeShipping] = useState(false);
  const [shippingFrom, setShippingFrom] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [terms, setTerms] = useState('');
  const [msrp, setMsrp] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [minimumOrder, setMinimumOrder] = useState('');
  const [metalKarat, setMetalKarat] = useState('');
  const [gemstones, setGemstones] = useState([]);
  const [supplierComment, setSupplierComment] = useState('');
  const [unpublished, setUnpublished] = useState(false);
  const [shareable, setShareable] = useState(false);
  const [ownStock, setOwnStock] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [links, setLinks] = useState([]);
  
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

  const [selectedProducts, setSelectedProducts] = useState([]);
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
  const [importProductType, setImportProductType] = useState('auto');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { router.push('/'); return; }
    load();
    loadMetadata();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(products.filter(p => {
      const matchesSearch = (p.title || '').toLowerCase().includes(q) ||
        (p.productType || '').toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q);
      const matchesType = activeTypeFilter === 'all' || p.productType === activeTypeFilter;
      return matchesSearch && matchesType;
    }));
  }, [search, products, activeTypeFilter]);

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

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;
    try {
      await Promise.all(selectedProducts.map(id => apiFetch(`/api/product/${id}`, { method: 'DELETE' })));
      setSelectedProducts([]);
      load();
    } catch (err) {
      alert("Failed to delete some products.");
    }
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
    const getAdd = (key) => (p.additionalInformation || []).find(i => i.key?.toLowerCase() === key.toLowerCase())?.value || '';
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
    
    // New Fields
    setAvailableForMemo(getAdd('Available for MEMO') === 'true');
    setCondition(getAdd('Condition'));
    setJewelryQuality(getAdd('Jewelry Quality'));
    setDesignerMaker(getAdd('Designer/Maker'));
    setFreeShipping(getAdd('Free Worldwide Shipping') === 'true');
    setShippingFrom(getAdd('Shipping from'));
    setCurrency(getAdd('Currency') || 'USD');
    setTerms(getAdd('Terms'));
    setMsrp(getAdd('MSRP'));
    setDeliveryTime(getAdd('Delivery Time'));
    setMinimumOrder(getAdd('Minimum Order'));
    setMetalKarat(getAdd('Metal Karat'));
    
    try { setGemstones(JSON.parse(getAdd('Gemstones') || '[]')); } catch(e) { setGemstones([]); }
    setSupplierComment(getAdd('Supplier Comment'));
    setUnpublished(getAdd('Unpublished') === 'true');
    setShareable(getAdd('Shareable') === 'true');
    setOwnStock(getAdd('Own Stock for Instant Inventory') === 'true');
    try { setDocuments(JSON.parse(getAdd('Documents') || '[]')); } catch(e) { setDocuments([]); }
    try { setLinks(JSON.parse(getAdd('Links') || '[]')); } catch(e) { setLinks([]); }

    
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
          { key: 'Available for MEMO', value: availableForMemo ? 'true' : 'false' },
          { key: 'Condition', value: condition },
          { key: 'Jewelry Quality', value: jewelryQuality },
          { key: 'Designer/Maker', value: designerMaker },
          { key: 'Free Worldwide Shipping', value: freeShipping ? 'true' : 'false' },
          { key: 'Shipping from', value: shippingFrom },
          { key: 'Currency', value: currency },
          { key: 'Terms', value: terms },
          { key: 'MSRP', value: msrp },
          { key: 'Delivery Time', value: deliveryTime },
          { key: 'Minimum Order', value: minimumOrder },
          { key: 'Metal Karat', value: metalKarat },
          { key: 'Gemstones', value: gemstones.length ? JSON.stringify(gemstones) : '' },
          { key: 'Supplier Comment', value: supplierComment },
          { key: 'Unpublished', value: unpublished ? 'true' : 'false' },
          { key: 'Shareable', value: shareable ? 'true' : 'false' },
          { key: 'Own Stock for Instant Inventory', value: ownStock ? 'true' : 'false' },
          { key: 'Documents', value: documents.length ? JSON.stringify(documents) : '' },
          { key: 'Links', value: links.length ? JSON.stringify(links) : '' },
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
    if (importProductType !== 'auto') {
      formData.append('productType', importProductType);
    }
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
    
    setAvailableForMemo(false);
    setCondition('');
    setJewelryQuality('');
    setDesignerMaker('');
    setFreeShipping(false);
    setShippingFrom('');
    setCurrency('USD');
    setTerms('');
    setMsrp('');
    setDeliveryTime('');
    setMinimumOrder('');
    setMetalKarat('');
    setGemstones([]);
    setSupplierComment('');
    setUnpublished(false);
    setShareable(false);
    setOwnStock(false);
    setDocuments([]);
    setLinks([]);

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
            {selectedProducts.length > 0 && (
              <button className="btn btn-danger" onClick={handleBulkDelete}>
                🗑️ Delete Selected ({selectedProducts.length})
              </button>
            )}
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

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: '🔹 All' },
            { key: 'jewelry', label: '💍 Jewellery' },
            { key: 'gemstone', label: '💎 Gemstone' },
            { key: 'diamond', label: '🔷 Loose Diamond' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTypeFilter(tab.key)}
              className={`btn${activeTypeFilter === tab.key ? ' btn-primary' : ''}`}
              style={{ fontSize: 13 }}
            >
              {tab.label} ({products.filter(p => tab.key === 'all' ? true : p.productType === tab.key).length})
            </button>
          ))}
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
                  <th style={{ width: 40 }}><input type="checkbox" onChange={(e) => setSelectedProducts(e.target.checked ? filtered.map(p => p._id || p.id) : [])} checked={filtered.length > 0 && selectedProducts.length === filtered.length} /></th>
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
                    <td><input type="checkbox" checked={selectedProducts.includes(p._id || p.id)} onChange={(e) => {
                      if (e.target.checked) setSelectedProducts([...selectedProducts, p._id || p.id]);
                      else setSelectedProducts(selectedProducts.filter(id => id !== (p._id || p.id)));
                    }} /></td>
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
                    <td>
                      {p.productType === 'diamond' ? (
                        <span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>🔷 Diamond</span>
                      ) : p.productType === 'gemstone' ? (
                        <span className="badge" style={{ background: '#fce7f3', color: '#9d174d' }}>💎 Gemstone</span>
                      ) : (
                        <span className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>💍 Jewellery</span>
                      )}
                    </td>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '20px' }}>
                  
                  {/* PRODUCT DESCRIPTION */}
                  <div className="card" style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', color: 'var(--brand)' }}>Product Description</h3>
                    
                    <div className="form-row">
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Product Type</label>
                        <select className="form-control" value={productType} onChange={(e) => setProductType(e.target.value)}>
                          <option value="jewelry">Jewellery</option>
                          <option value="diamond">Diamond</option>
                          <option value="gemstone">Gemstone</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Stock # (SKU) *</label>
                        <input className="form-control" placeholder="SKU-RING-01" value={sku} onChange={(e) => setSku(e.target.value)} required={productType !== 'diamond'} />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group checkbox-row" style={{ marginRight: '20px' }}>
                        <input type="checkbox" id="available-checkbox" checked={status === 'in-stock'} onChange={(e) => setStatus(e.target.checked ? 'in-stock' : 'out-of-stock')} />
                        <label htmlFor="available-checkbox" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Available</label>
                      </div>
                      <div className="form-group checkbox-row">
                        <input type="checkbox" id="memo-checkbox" checked={availableForMemo} onChange={(e) => setAvailableForMemo(e.target.checked)} />
                        <label htmlFor="memo-checkbox" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Available for MEMO</label>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group" style={{ width: '100%' }}>
                        <label className="form-label">Item Title *</label>
                        <input className="form-control" placeholder="Diamond Engagement Ring" value={title} onChange={(e) => setTitle(e.target.value)} required={productType !== 'diamond'} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" rows={3} placeholder="Write a description for this jewelry item..." value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                  </div>

                  {/* PRODUCT INFORMATION */}
                  <div className="card" style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', color: 'var(--brand)' }}>Product Information</h3>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Jewelry Type (Category) *</label>
                        <Select 
                          options={Array.from(new Map(categories.map(c => [
                            ((c.parent || '').trim().toLowerCase().replace(/s$/, '').replace('pendent', 'pendant')), 
                            { value: c.id || c._id, label: c.parent }
                          ])).values())}
                          value={categories.filter(c => (c.id || c._id) === categoryId).map(c => ({ value: c.id || c._id, label: c.parent }))}
                          onChange={(opt) => { setCategoryId(opt?.value || ''); setSubCategory(''); }}
                          isClearable
                          placeholder="Select Jewelry Type"
                          styles={{ control: (base) => ({ ...base, minHeight: '42px', borderColor: 'var(--border)' }) }}
                          components={{ MenuList: CustomMenuList }}
                          onAddNew={() => setShowNewCategory(true)}
                          addNewLabel="jewelry type"
                          required={productType !== 'diamond'}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Type Style (Sub Category)</label>
                        <Select
                          options={Array.from(new Set(subCategoryOptions.map(sub => sub))).filter((v, i, a) => a.findIndex(t => t.trim().toLowerCase().replace(/s$/, '').replace('pendent', 'pendant') === v.trim().toLowerCase().replace(/s$/, '').replace('pendent', 'pendant')) === i).map(sub => ({ value: sub, label: sub }))}
                          value={subCategory ? { value: subCategory, label: subCategory } : null}
                          onChange={(opt) => setSubCategory(opt?.value || '')}
                          isClearable
                          placeholder="Select Style"
                          styles={{ control: (base) => ({ ...base, minHeight: '42px', borderColor: 'var(--border)' }) }}
                          components={{ MenuList: CustomMenuList }}
                          onAddNew={() => setShowNewSub(true)}
                          addNewLabel="style"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Jewelry Category</label>
                        <input className="form-control" placeholder="E.g. Vintage" value={poeticName} onChange={(e) => setPoeticName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Condition</label>
                        <select className="form-control" value={condition} onChange={(e) => setCondition(e.target.value)}>
                          <option value="">Select Condition</option>
                          <option value="New">New</option>
                          <option value="Pre-owned">Pre-owned</option>
                          <option value="Vintage">Vintage</option>
                          <option value="Antique">Antique</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Brand</label>
                        <select className="form-control" value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                          <option value="">Select Brand</option>
                          {brands.map(b => (
                            <option key={b.id || b._id} value={b.id || b._id}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Jewelry Quality</label>
                        <select className="form-control" value={jewelryQuality} onChange={(e) => setJewelryQuality(e.target.value)}>
                          <option value="">Select Quality</option>
                          <option value="Fine">Fine</option>
                          <option value="Fashion">Fashion</option>
                          <option value="High Jewelry">High Jewelry</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Designer / Maker</label>
                        <input className="form-control" placeholder="E.g. Cartier" value={designerMaker} onChange={(e) => setDesignerMaker(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Keyword Descriptions (Tags)</label>
                        <input className="form-control" placeholder="E.g. classic, gold, gift" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* PRICE & LOCATION */}
                  <div className="card" style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', color: 'var(--brand)' }}>Price & Location</h3>
                    
                    <div className="form-group checkbox-row" style={{ marginBottom: '15px' }}>
                      <input type="checkbox" id="freeship-checkbox" checked={freeShipping} onChange={(e) => setFreeShipping(e.target.checked)} />
                      <label htmlFor="freeship-checkbox" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Free Worldwide Shipping</label>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Shipping From</label>
                        <input className="form-control" placeholder="E.g. New York, USA" value={shippingFrom} onChange={(e) => setShippingFrom(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Price / Piece *</label>
                        <input className="form-control" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Currency</label>
                        <select className="form-control" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="INR">INR (₹)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Terms</label>
                        <select className="form-control" value={terms} onChange={(e) => setTerms(e.target.value)}>
                          <option value="">Select Terms</option>
                          <option value="FOB">FOB</option>
                          <option value="CIF">CIF</option>
                          <option value="EXW">EXW</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">MSRP</label>
                        <input className="form-control" type="number" step="0.01" value={msrp} onChange={(e) => setMsrp(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Delivery Time</label>
                        <input className="form-control" placeholder="E.g. 3-5 Business Days" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label"># Items in Stock *</label>
                        <input className="form-control" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Minimum Order</label>
                        <input className="form-control" type="number" value={minimumOrder} onChange={(e) => setMinimumOrder(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* METAL & GEMSTONES */}
                  <div className="card" style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', color: 'var(--brand)' }}>Metal & Gemstones</h3>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Metal Type</label>
                        <select className="form-control" value={metal} onChange={(e) => setMetal(e.target.value)}>
                          <option value="">Select Metal</option>
                          <option value="Gold">Gold</option>
                          <option value="Platinum">Platinum</option>
                          <option value="Silver">Silver</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Metal Karat</label>
                        <select className="form-control" value={metalKarat} onChange={(e) => setMetalKarat(e.target.value)}>
                          <option value="">Select Karat</option>
                          <option value="24K">24K</option>
                          <option value="22K">22K</option>
                          <option value="18K">18K</option>
                          <option value="14K">14K</option>
                          <option value="10K">10K</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Jewelry Total Weight (gms)</label>
                        <input className="form-control" type="number" step="0.01" value={grossGms} onChange={(e) => setGrossGms(e.target.value)} />
                      </div>
                    </div>

                    <div style={{ marginTop: '20px', borderTop: '1px dashed var(--border)', paddingTop: '15px' }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Gemstones</h4>
                      {gemstones.map((gem, index) => (
                        <div key={index} style={{ padding: '15px', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '10px', position: 'relative' }}>
                          <button type="button" onClick={() => setGemstones(gemstones.filter((_, i) => i !== index))} className="btn btn-sm btn-danger" style={{ position: 'absolute', top: 10, right: 10 }}>Remove</button>
                          
                          <div className="form-row" style={{ marginTop: '10px' }}>
                            <div className="form-group"><label className="form-label">Type</label><input className="form-control" value={gem.type || ''} onChange={e => { const g = [...gemstones]; g[index].type = e.target.value; setGemstones(g); }} /></div>
                            <div className="form-group"><label className="form-label">Shape</label><input className="form-control" value={gem.shape || ''} onChange={e => { const g = [...gemstones]; g[index].shape = e.target.value; setGemstones(g); }} /></div>
                            <div className="form-group"><label className="form-label">Carat Wt.</label><input className="form-control" value={gem.caratWeight || ''} onChange={e => { const g = [...gemstones]; g[index].caratWeight = e.target.value; setGemstones(g); }} /></div>
                          </div>
                          
                          <div className="form-row">
                            <div className="form-group"><label className="form-label">Lab</label><input className="form-control" value={gem.lab || ''} onChange={e => { const g = [...gemstones]; g[index].lab = e.target.value; setGemstones(g); }} /></div>
                            <div className="form-group"><label className="form-label">Lab #</label><input className="form-control" value={gem.labNo || ''} onChange={e => { const g = [...gemstones]; g[index].labNo = e.target.value; setGemstones(g); }} /></div>
                            <div className="form-group"><label className="form-label">Treatment</label><input className="form-control" value={gem.treatment || ''} onChange={e => { const g = [...gemstones]; g[index].treatment = e.target.value; setGemstones(g); }} /></div>
                          </div>

                          <div className="form-row">
                            <div className="form-group"><label className="form-label"># Stones</label><input className="form-control" type="number" value={gem.numStones || ''} onChange={e => { const g = [...gemstones]; g[index].numStones = e.target.value; setGemstones(g); }} /></div>
                            <div className="form-group"><label className="form-label">Lot #</label><input className="form-control" value={gem.lotNo || ''} onChange={e => { const g = [...gemstones]; g[index].lotNo = e.target.value; setGemstones(g); }} /></div>
                          </div>
                        </div>
                      ))}
                      
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setGemstones([...gemstones, {}])}>
                        + Add another Gemstone
                      </button>
                    </div>
                  </div>

                  {/* SUPPLIER COMMENT & MEASUREMENTS */}
                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="card" style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff' }}>
                      <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', color: 'var(--brand)' }}>Supplier Comment</h3>
                      <textarea className="form-control" rows={4} placeholder="Internal comments or notes from supplier..." value={supplierComment} onChange={(e) => setSupplierComment(e.target.value)} />
                    </div>
                    
                    <div className="card" style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff' }}>
                      <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', color: 'var(--brand)' }}>Measurements</h3>
                      <div className="form-group">
                        <label className="form-label">Sizes (Comma separated)</label>
                        <input className="form-control" placeholder="E.g. 6, 7, 8" value={sizesInput} onChange={(e) => setSizesInput(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* VISIBILITY */}
                  <div className="card" style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', color: 'var(--brand)' }}>Visibility</h3>
                    
                    <div className="form-row">
                      <div className="form-group checkbox-row" style={{ flex: 1 }}>
                        <input type="checkbox" id="unpub-checkbox" checked={unpublished} onChange={(e) => setUnpublished(e.target.checked)} />
                        <label htmlFor="unpub-checkbox" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Unpublished</label>
                      </div>
                      <div className="form-group checkbox-row" style={{ flex: 1 }}>
                        <input type="checkbox" id="share-checkbox" checked={shareable} onChange={(e) => setShareable(e.target.checked)} />
                        <label htmlFor="share-checkbox" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Shareable</label>
                      </div>
                      <div className="form-group checkbox-row" style={{ flex: 1 }}>
                        <input type="checkbox" id="own-checkbox" checked={ownStock} onChange={(e) => setOwnStock(e.target.checked)} />
                        <label htmlFor="own-checkbox" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Own Stock for Instant Inventory</label>
                      </div>
                      <div className="form-group checkbox-row" style={{ flex: 1 }}>
                        <input type="checkbox" id="feat-checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                        <label htmlFor="feat-checkbox" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Featured on Homepage</label>
                      </div>
                    </div>
                  </div>

                  {/* IMAGES */}
                  <div className="card" style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', color: 'var(--brand)' }}>Images</h3>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Primary Image *</label>
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
                        <label className="form-label">Additional Image 1</label>
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
                      <div className="form-group">
                        <label className="form-label">Additional Image 2</label>
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
                        <label className="form-label">Additional Image 3</label>
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
                    
                    <div className="form-row" style={{ marginTop: '15px' }}>
                      <div className="form-group">
                        <label className="form-label">Video (Upload or URL)</label>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <input className="form-control" placeholder="URL or upload..." value={video1} onChange={e => setVideo1(e.target.value)} style={{ flex: 1 }} />
                          <label className="btn btn-sm" style={{ cursor: 'pointer', margin: 0, display: 'flex', alignItems: 'center' }}>
                            {uploadingV1 ? '...' : 'Upload'}
                            <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleSlotUpload(e, setVideo1, setUploadingV1)} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DOCUMENTS */}
                  <div className="card" style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', color: 'var(--brand)' }}>Documents</h3>
                    {documents.map((doc, index) => (
                      <div key={index} className="form-row" style={{ position: 'relative', marginBottom: '10px' }}>
                        <div className="form-group"><input className="form-control" placeholder="Type (e.g. Certificate)" value={doc.type || ''} onChange={e => { const d = [...documents]; d[index].type = e.target.value; setDocuments(d); }} /></div>
                        <div className="form-group"><input className="form-control" placeholder="Title" value={doc.title || ''} onChange={e => { const d = [...documents]; d[index].title = e.target.value; setDocuments(d); }} /></div>
                        <div className="form-group" style={{ display: 'flex', gap: 6 }}>
                          <input className="form-control" placeholder="URL or file link" value={doc.url || ''} onChange={e => { const d = [...documents]; d[index].url = e.target.value; setDocuments(d); }} style={{ flex: 1 }} />
                          <label className="btn btn-sm" style={{ cursor: 'pointer', margin: 0, display: 'flex', alignItems: 'center' }}>
                            Upload
                            <input type="file" style={{ display: 'none' }} onChange={e => { e.target.parentElement.childNodes[0].nodeValue = '...'; handleSlotUpload(e, (url) => { const d = [...documents]; d[index].url = url; setDocuments(d); }, () => {}).finally(() => e.target.parentElement.childNodes[0].nodeValue = 'Upload'); }} />
                          </label>
                        </div>
                        <button type="button" onClick={() => setDocuments(documents.filter((_, i) => i !== index))} className="btn btn-sm btn-danger" style={{ alignSelf: 'flex-start', marginTop: '5px' }}>✕</button>
                      </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setDocuments([...documents, {}])}>+ Add Document</button>
                  </div>

                  {/* LINKS */}
                  <div className="card" style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', color: 'var(--brand)' }}>Links</h3>
                    {links.map((link, index) => (
                      <div key={index} className="form-row" style={{ position: 'relative', marginBottom: '10px' }}>
                        <div className="form-group"><input className="form-control" placeholder="Type (e.g. WhatsApp)" value={link.type || ''} onChange={e => { const l = [...links]; l[index].type = e.target.value; setLinks(l); }} /></div>
                        <div className="form-group" style={{ display: 'flex', gap: 6 }}>
                          <input className="form-control" placeholder="URL" value={link.url || ''} onChange={e => { const l = [...links]; l[index].url = e.target.value; setLinks(l); }} style={{ flex: 1 }} />
                          <label className="btn btn-sm" style={{ cursor: 'pointer', margin: 0, display: 'flex', alignItems: 'center' }}>
                            Upload
                            <input type="file" style={{ display: 'none' }} onChange={e => { e.target.parentElement.childNodes[0].nodeValue = '...'; handleSlotUpload(e, (url) => { const l = [...links]; l[index].url = url; setLinks(l); }, () => {}).finally(() => e.target.parentElement.childNodes[0].nodeValue = 'Upload'); }} />
                          </label>
                        </div>
                        <div className="form-group"><input className="form-control" placeholder="Title" value={link.title || ''} onChange={e => { const l = [...links]; l[index].title = e.target.value; setLinks(l); }} /></div>
                        <button type="button" onClick={() => setLinks(links.filter((_, i) => i !== index))} className="btn btn-sm btn-danger" style={{ alignSelf: 'flex-start', marginTop: '5px' }}>✕</button>
                      </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setLinks([...links, {}])}>+ Add Link</button>
                  </div>
                  
                  <div className="modal-actions" style={{ position: 'sticky', bottom: '-20px', background: '#fff', padding: '15px 0', borderTop: '1px solid var(--border)', margin: '0 -20px -20px -20px', paddingLeft: '20px', paddingRight: '20px', zIndex: 10 }}>
                    <button type="button" className="btn" onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={submitting || uploadingP1 || uploadingP2 || uploadingP3 || uploadingP4 || uploadingV1 || uploadingV2}>
                      {submitting ? <div className="spinner" /> : 'Save Product'}
                    </button>
                  </div>
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
                  <label className="form-label">Product Type</label>
                  <select className="form-control" value={importProductType} onChange={(e) => setImportProductType(e.target.value)}>
                    <option value="auto">🔍 Auto-Detect from File Headers</option>
                    <option value="jewelry">💍 Jewellery</option>
                    <option value="gemstone">💎 Gemstone</option>
                    <option value="diamond">🔷 Loose Diamond</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Excel / CSV File *</label>
                  <input type="file" className="form-control" accept=".xlsx,.xls,.csv" onChange={(e) => setImportFile(e.target.files[0])} required />
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
