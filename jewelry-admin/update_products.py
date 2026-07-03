import re

with open("pages/products.js", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Add Select import
if "import Select from 'react-select';" not in text:
    text = text.replace("import AdminLayout", "import Select from 'react-select';\nimport AdminLayout")

# 2. Add new states
new_states = """  const [poeticName, setPoeticName] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [metal, setMetal] = useState('');
  const [metalGms, setMetalGms] = useState('');
  const [diamondPcs, setDiamondPcs] = useState('');
  const [shape, setShape] = useState('');
  const [certificate, setCertificate] = useState('');
  const [certNo, setCertNo] = useState('');
  const [grossGms, setGrossGms] = useState('');
  const [usdPrice, setUsdPrice] = useState('');
  
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [showNewSub, setShowNewSub] = useState(false);
  const [newSubName, setNewSubName] = useState('');
"""
text = text.replace("const [featured, setFeatured] = useState(false);", "const [featured, setFeatured] = useState(false);\n" + new_states)

# 3. Add to resetForm (Wait, I need to find resetForm, if it exists)
reset_form_addition = """    setPoeticName('');
    setLotNumber('');
    setMetal('');
    setMetalGms('');
    setDiamondPcs('');
    setShape('');
    setCertificate('');
    setCertNo('');
    setGrossGms('');
    setUsdPrice('');
    setShowNewCategory(false);
    setShowNewSub(false);
"""
# If resetForm exists, inject it
if "const resetForm" in text:
    text = re.sub(r'(const resetForm = \(\) => {[\s\S]*?setFeatured\(false\);)', r'\1\n' + reset_form_addition, text)

# 4. Handle Edit Click
edit_click_addition = """    const getAdd = (key) => (p.additionalInformation || []).find(i => i.key === key)?.value || '';
    setPoeticName(getAdd('Poetic Name'));
    setLotNumber(getAdd('Lot Number'));
    setMetal(getAdd('Metal'));
    setMetalGms(getAdd('Metal gms'));
    setDiamondPcs(getAdd('Diamond Pcs'));
    setShape(getAdd('Shape'));
    setCertificate(getAdd('Certificate'));
    setCertNo(getAdd('Cert.No'));
    setGrossGms(getAdd('Gross Gms'));
    setUsdPrice(getAdd('USD Price'));
"""
text = re.sub(r'(setFeatured\(p\.featured \|\| false\);)', r'\1\n' + edit_click_addition, text)

# 5. Handle Submit Payload
payload_addition = """        additionalInformation: [
          { key: 'Jewellery', value: selectedCategory ? selectedCategory.parent : '' },
          { key: 'Product', value: subCategory || '' },
          { key: 'Poetic Name', value: poeticName },
          { key: 'Lot Number', value: lotNumber },
          { key: 'Metal', value: metal },
          { key: 'Metal gms', value: metalGms },
          { key: 'Diamond Pcs', value: diamondPcs },
          { key: 'Shape', value: shape },
          { key: 'Certificate', value: certificate },
          { key: 'Cert.No', value: certNo },
          { key: 'Gross Gms', value: grossGms },
          { key: 'USD Price', value: usdPrice },
        ].filter(i => i.value),
"""
text = text.replace("featured,", "featured,\n" + payload_addition)

# 6. Add functions to create new categories
new_cat_funcs = """
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
"""
text = text.replace("const handleEditClick =", new_cat_funcs + "\n  const handleEditClick =")

# 7. Add extra fields to the UI form
extra_fields_ui = """
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
"""

# Replace tags/sizes row with tags/sizes + extra_fields_ui
# Find the exact text in products.js around Tags and Sizes
text = text.replace(
    '<div className="form-row">\n                  <div className="form-group">\n                    <label className="form-label">Tags (Comma separated)</label>',
    extra_fields_ui + '\n                <div className="form-row">\n                  <div className="form-group">\n                    <label className="form-label">Tags (Comma separated)</label>'
)

# 8. Replace Category and Subcategory dropdowns with React-Select and Add options
old_category = """<div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-control" value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setSubCategory(''); }} required>
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.id || c._id} value={c.id || c._id}>{c.parent}</option>
                      ))}
                    </select>
                  </div>"""

new_category = """<div className="form-group">
                    <label className="form-label">Category *</label>
                    <Select 
                      options={categories.map(c => ({ value: c.id || c._id, label: c.parent }))}
                      value={categories.filter(c => (c.id || c._id) === categoryId).map(c => ({ value: c.id || c._id, label: c.parent }))}
                      onChange={(opt) => { setCategoryId(opt?.value || ''); setSubCategory(''); }}
                      isClearable
                      placeholder="Select Category"
                      styles={{ control: (base) => ({ ...base, minHeight: '42px', borderColor: 'var(--border)' }) }}
                    />
                    {!showNewCategory ? (
                      <button type="button" className="btn btn-sm" style={{ marginTop: 6, color: 'var(--brand)', padding: 0, background: 'transparent' }} onClick={() => setShowNewCategory(true)}>+ Add new category</button>
                    ) : (
                      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                        <input className="form-control form-control-sm" placeholder="New category name" value={newCatName} onChange={e => setNewCatName(e.target.value)} style={{ flex: 1 }} />
                        <button type="button" className="btn btn-sm btn-primary" onClick={handleAddNewCategory}>Add</button>
                        <button type="button" className="btn btn-sm" onClick={() => setShowNewCategory(false)}>Cancel</button>
                      </div>
                    )}
                  </div>"""

old_subcat = """<div className="form-group">
                    <label className="form-label">Sub Category</label>
                    <select className="form-control" value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                      <option value="">Select Subcategory</option>
                      {categories.find(c => (c.id || c._id) === categoryId)?.children?.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>"""

new_subcat = """<div className="form-group">
                    <label className="form-label">Sub Category</label>
                    <Select 
                      options={(categories.find(c => (c.id || c._id) === categoryId)?.children || []).map(sub => ({ value: sub, label: sub }))}
                      value={subCategory ? { value: subCategory, label: subCategory } : null}
                      onChange={(opt) => setSubCategory(opt?.value || '')}
                      isClearable
                      placeholder="Select Subcategory"
                      styles={{ control: (base) => ({ ...base, minHeight: '42px', borderColor: 'var(--border)' }) }}
                      isDisabled={!categoryId}
                    />
                    {categoryId && !showNewSub ? (
                      <button type="button" className="btn btn-sm" style={{ marginTop: 6, color: 'var(--brand)', padding: 0, background: 'transparent' }} onClick={() => setShowNewSub(true)}>+ Add new sub category</button>
                    ) : categoryId && showNewSub ? (
                      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                        <input className="form-control form-control-sm" placeholder="New subcategory name" value={newSubName} onChange={e => setNewSubName(e.target.value)} style={{ flex: 1 }} />
                        <button type="button" className="btn btn-sm btn-primary" onClick={handleAddNewSubCategory}>Add</button>
                        <button type="button" className="btn btn-sm" onClick={() => setShowNewSub(false)}>Cancel</button>
                      </div>
                    ) : null}
                  </div>"""

text = text.replace(old_category, new_category)
text = text.replace(old_subcat, new_subcat)

with open("pages/products.js", "w", encoding="utf-8") as f:
    f.write(text)

print("Product form updated!")
