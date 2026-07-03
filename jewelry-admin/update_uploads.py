import re

with open("pages/products.js", "r", encoding="utf-8") as f:
    text = f.read()

# 1. State changes
state_changes = """  const [photo1, setPhoto1] = useState('');
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
"""
# Replace primaryImage, additionalImages, videoId, etc.
# Wait, replacing is hard if they are scattered. Let's just append the new states.
text = text.replace("const [additionalImages, setAdditionalImages] = useState([]);", "const [additionalImages, setAdditionalImages] = useState([]);\n" + state_changes)

# 2. handleEditClick
edit_addition = """    setPhoto1(p.img || '');
    const addImgs = (p.imageURLs || []).map(i => i.img || i).filter(url => url !== p.img);
    setPhoto2(addImgs[0] || '');
    setPhoto3(addImgs[1] || '');
    setPhoto4(addImgs[2] || '');
    setVideo1(p.videoId || '');
    setVideo2(getAdd('Video 2'));
"""
text = text.replace("setPrimaryImage(p.img || '');", edit_addition + "\n    setPrimaryImage(p.img || '');")

# 3. resetForm
reset_addition = """    setPhoto1('');
    setPhoto2('');
    setPhoto3('');
    setPhoto4('');
    setVideo1('');
    setVideo2('');
"""
if "const resetForm" in text:
    text = re.sub(r'(const resetForm = \(\) => {[\s\S]*?setFeatured\(false\);)', r'\1\n' + reset_addition, text)

# 4. handleSubmit payload
# we need to override `img`, `imageURLs`, `videoId`, and `Video 2` in additionalInformation.
# First, remove `img: primaryImage,` and `imageURLs: additionalImages.map(...)` if they exist. No, let's just use re.sub.
text = re.sub(r'img: primaryImage,', r'img: photo1,', text)
text = re.sub(r'imageURLs: additionalImages\.map.*?\}\)\),', r'imageURLs: [photo2, photo3, photo4].filter(Boolean).map(url => ({ color: {name:"", clrCode:""}, img: url })),', text, flags=re.DOTALL)
text = re.sub(r'videoId: videoId \|\| null,', r'videoId: video1 || null,', text)
# Add Video 2 to additionalInformation
text = text.replace("{ key: 'USD Price', value: usdPrice },", "{ key: 'USD Price', value: usdPrice },\n          { key: 'Video 2', value: video2 },")
# Change validation
text = text.replace("!primaryImage", "!photo1")

# 5. Handle Upload Handlers
upload_handlers = """
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
"""
text = text.replace("const handlePrimaryUpload = async", upload_handlers + "\n  const handlePrimaryUpload = async")

# 6. Replace UI
# Remove the old videoId field
text = re.sub(r'<div className="form-group">\s*<label className="form-label">YouTube Video ID \(Optional\)</label>\s*<input className="form-control" placeholder="dQw4w9WgXcQ" value=\{videoId\}.*?</div>', '', text, flags=re.DOTALL)

# Build new Media Section
media_section = """
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
"""

# Replace the old Primary Image / Additional Images block
text = re.sub(r'<div className="form-row">\s*\{\/\* Primary Image \*\/\}[\s\S]*?\{\/\* Additional Images \*\/\}[\s\S]*?<\/div>', media_section, text)

# Write back
with open("pages/products.js", "w", encoding="utf-8") as f:
    f.write(text)

print("Products UI replaced successfully!")
