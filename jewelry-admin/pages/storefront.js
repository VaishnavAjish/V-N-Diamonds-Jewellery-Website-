import { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../components/AdminLayout';
import { apiFetch, API_BASE } from '../lib/api';

export default function StorefrontSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroBanners, setHeroBanners] = useState([
    { subtitle: 'The original', title: 'Shine bright', img: '', navTitle: 'Ring <br />& Earring', navIcon: '' },
    { subtitle: 'The original', title: 'Creative Design', img: '', navTitle: 'Bangles & <br />Bracelets', navIcon: '' },
    { subtitle: 'The original', title: 'Gold Plateted', img: '', navTitle: 'Drop <br /> Necklaces', navIcon: '' },
    { subtitle: 'The original', title: 'Unique shapes', img: '', navTitle: 'Diamond <br /> Necklaces', navIcon: '' },
  ]);
  const [instagramFeed, setInstagramFeed] = useState(Array(6).fill(''));
  const [shopBanners, setShopBanners] = useState([
    { subtitle: 'Collection', title: 'Ardeco pearl Rings style 2023', img: '' },
    { subtitle: 'Trending', title: 'Tropical Set', img: '' },
    { subtitle: 'New Arrival', title: 'Gold Jewelry', img: '' },
    { subtitle: 'Collection', title: 'Earring whitegold with diamonds', img: '' },
  ]);
  const [aboutSection, setAboutSection] = useState({
    title: 'Shop our limited Edition Collaborations',
    subtitle: 'Unity Collection',
    mainImg: '',
    floatingImg: '',
    description: '',
  });
  const [collectionBanner, setCollectionBanner] = useState({
    title: 'Our finest jewelry',
    leftImg: '',
    rightImg: '',
  });
  const [brands, setBrands] = useState(['']);
  const [footerLogo, setFooterLogo] = useState('');
  const [featureItems, setFeatureItems] = useState([
    { title: 'Free Delivery', subtitle: 'Orders from all item' },
    { title: 'Return & Refund', subtitle: 'Money back guarantee' },
    { title: 'Member Discount', subtitle: 'Onevery order over $140.00' },
    { title: 'Support 24/7', subtitle: 'Contact us 24 hours a day' },
  ]);
  const [csrImages, setCsrImages] = useState(Array(4).fill(''));
  const [expertiseImages, setExpertiseImages] = useState(Array(4).fill(''));
  const [careInstructionsImages, setCareInstructionsImages] = useState(Array(3).fill(''));
  const [ourServicesImage, setOurServicesImage] = useState('');
  
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    location: ''
  });
  
  const [teamMembers, setTeamMembers] = useState([
    { img: '', name: 'Vipul Maheshwari' },
    { img: '', name: 'Nidhi Vipul Maheshwari' },
    { img: '', name: 'Prakhar Maheshwari' }
  ]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/settings/storefront`);
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.heroBanners) {
          const loaded = data.data.heroBanners;
          const defaults = [
            { subtitle: 'The original', title: 'Shine bright', img: '', navTitle: 'Ring <br />& Earring', navIcon: '' },
            { subtitle: 'The original', title: 'Creative Design', img: '', navTitle: 'Bangles & <br />Bracelets', navIcon: '' },
            { subtitle: 'The original', title: 'Gold Plateted', img: '', navTitle: 'Drop <br /> Necklaces', navIcon: '' },
            { subtitle: 'The original', title: 'Unique shapes', img: '', navTitle: 'Diamond <br /> Necklaces', navIcon: '' },
          ];
          const padded = defaults.map((def, i) => loaded[i] || def);
          setHeroBanners(padded);
        }
        if (data.data.instagramFeed) setInstagramFeed(data.data.instagramFeed);
        if (data.data.shopBanners?.length === 4) setShopBanners(data.data.shopBanners);
        if (data.data.aboutSection) setAboutSection((prev) => ({ ...prev, ...data.data.aboutSection }));
        if (data.data.collectionBanner) setCollectionBanner((prev) => ({ ...prev, ...data.data.collectionBanner }));
        if (data.data.brands?.length > 0) setBrands(data.data.brands);
        if (data.data.footerLogo) setFooterLogo(data.data.footerLogo);
        if (data.data.featureItems?.length === 4) setFeatureItems(data.data.featureItems);
        if (data.data.csrImages?.length > 0) setCsrImages(data.data.csrImages);
        if (data.data.expertiseImages?.length > 0) setExpertiseImages(data.data.expertiseImages);
        if (data.data.careInstructionsImages?.length > 0) setCareInstructionsImages(data.data.careInstructionsImages);
        if (data.data.ourServicesImage) setOurServicesImage(data.data.ourServicesImage);
        if (data.data.contactInfo) setContactInfo((prev) => ({ ...prev, ...data.data.contactInfo }));
        if (data.data.teamMembers?.length > 0) setTeamMembers(data.data.teamMembers);
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/settings/storefront`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroBanners,
          instagramFeed,
          shopBanners,
          aboutSection,
          collectionBanner,
          brands,
          footerLogo,
          featureItems,
          csrImages,
          expertiseImages,
          careInstructionsImages,
          ourServicesImage,
          contactInfo,
          teamMembers,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Storefront settings saved successfully!');
      } else {
        alert('Failed to save settings: ' + data.message);
      }
    } catch (err) {
      alert('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch(`${API_BASE}/api/cloudinary/add-img`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        callback(data.data.url);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    }
  };

  if (loading) return <AdminLayout title="Storefront Settings"><div className="loading-spinner">Loading...</div></AdminLayout>;

  return (
    <>
      <Head><title>Storefront — Harene Diamonds Admin</title></Head>
      <AdminLayout title="Storefront Settings" subtitle="Manage landing page content">
        <div className="page-header">
          <div>
            <h1>Landing Page Settings</h1>
            <p>Customize the text and images displayed on your storefront</p>
          </div>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>

        <div className="card mb-4 p-4">
          <h2 className="section-title">Contact Information</h2>
          <p className="text-secondary" style={{ fontSize: 13, marginBottom: 15 }}>Update the email, phone, and address shown on the storefront (e.g., footer).</p>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                value={contactInfo.email} 
                onChange={e => setContactInfo({...contactInfo, email: e.target.value})} 
                placeholder="vipul@vndiamonds.com" 
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Phone Number</label>
              <input 
                type="text" 
                className="form-control" 
                value={contactInfo.phone} 
                onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} 
                placeholder="+852-69731885" 
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Location / Address</label>
              <input 
                type="text" 
                className="form-control" 
                value={contactInfo.location} 
                onChange={e => setContactInfo({...contactInfo, location: e.target.value})} 
                placeholder="Suite D, 25/F..." 
              />
            </div>
          </div>
        </div>

        <div className="card mb-4 p-4">
          <h2 className="section-title">Our Team Section</h2>
          <p className="text-secondary" style={{ fontSize: 13, marginBottom: 15 }}>Manage the team members displayed in the About Us page.</p>
          <div className="row">
            {teamMembers.map((member, i) => (
              <div key={i} className="col-md-4 mb-3">
                <div style={{ padding: '15px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <div className="form-group mb-3">
                    <label>Name</label>
                    <input type="text" className="form-control" value={member.name} onChange={(e) => {
                      const newMembers = [...teamMembers];
                      newMembers[i].name = e.target.value;
                      setTeamMembers(newMembers);
                    }} />
                  </div>
                  <div className="form-group mb-3">
                    <label>Photo</label>
                    <input type="file" className="form-control" onChange={(e) => uploadImage(e, (url) => {
                      const newMembers = [...teamMembers];
                      newMembers[i].img = url;
                      setTeamMembers(newMembers);
                    })} />
                  </div>
                  {member.img && <img src={member.img} alt={member.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <h3>Hero Banners</h3>
          <p className="text-muted">The main slider at the top of the landing page.</p>
          <hr style={{ margin: '15px 0' }} />
          
          {heroBanners.map((banner, i) => (
            <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '20px', padding: '15px', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <div style={{ flex: 1 }}>
                <div className="form-group">
                  <label>Subtitle (e.g. "The original")</label>
                  <input type="text" className="form-control" value={banner.subtitle} onChange={(e) => {
                    const newBanners = [...heroBanners];
                    newBanners[i].subtitle = e.target.value;
                    setHeroBanners(newBanners);
                  }} />
                </div>
                <div className="form-group">
                  <label>Title (e.g. "Shine bright")</label>
                  <input type="text" className="form-control" value={banner.title} onChange={(e) => {
                    const newBanners = [...heroBanners];
                    newBanners[i].title = e.target.value;
                    setHeroBanners(newBanners);
                  }} />
                </div>
                <div className="form-group">
                  <label>Banner Image</label>
                  <input type="file" className="form-control" onChange={(e) => uploadImage(e, (url) => {
                    const newBanners = [...heroBanners];
                    newBanners[i].img = url;
                    setHeroBanners(newBanners);
                  })} />
                </div>
                <div className="form-group">
                  <label>Sidebar Object Text (e.g. "Ring &lt;br /&gt;&amp; Earring")</label>
                  <input type="text" className="form-control" value={banner.navTitle || ''} onChange={(e) => {
                    const newBanners = [...heroBanners];
                    newBanners[i].navTitle = e.target.value;
                    setHeroBanners(newBanners);
                  }} />
                </div>
                <div className="form-group">
                  <label>Sidebar Object Icon</label>
                  <input type="file" className="form-control" onChange={(e) => uploadImage(e, (url) => {
                    const newBanners = [...heroBanners];
                    newBanners[i].navIcon = url;
                    setHeroBanners(newBanners);
                  })} />
                  {banner.navIcon && <img src={banner.navIcon} alt="Nav Icon Preview" style={{ maxWidth: '40px', marginTop: '10px', filter: 'invert(1)' }} />}
                </div>
              </div>
              <div style={{ width: '200px', height: '120px', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {banner.img ? <img src={banner.img} alt="Banner Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} /> : 'No Image'}
              </div>
            </div>
          ))}
          
          <button className="btn-secondary" onClick={() => setHeroBanners([...heroBanners, { subtitle: '', title: '', img: '', navTitle: '', navIcon: '' }])}>
            + Add Another Banner
          </button>
        </div>

        <div className="card">
          <h3>Instagram Feed</h3>
          <p className="text-muted">Images displayed in the Instagram gallery section (Requires 6 images).</p>
          <hr style={{ margin: '15px 0' }} />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {instagramFeed.map((imgUrl, i) => (
              <div key={i} style={{ padding: '15px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <div style={{ width: '100%', height: '150px', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  {imgUrl ? <img src={imgUrl} alt={`Insta ${i+1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} /> : `Image ${i+1}`}
                </div>
                <input type="file" className="form-control" onChange={(e) => uploadImage(e, (url) => {
                  const newFeed = [...instagramFeed];
                  newFeed[i] = url;
                  setInstagramFeed(newFeed);
                })} />
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: '24px' }}>
          <h3>Shop Banners</h3>
          <p className="text-muted">The 4 category banners below the hero slider (Requires 4 images).</p>
          <hr style={{ margin: '15px 0' }} />

          {shopBanners.map((banner, i) => (
            <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '20px', padding: '15px', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <div style={{ flex: 1 }}>
                <div className="form-group">
                  <label>Subtitle (e.g. "Collection")</label>
                  <input type="text" className="form-control" value={banner.subtitle} onChange={(e) => {
                    const next = [...shopBanners];
                    next[i] = { ...next[i], subtitle: e.target.value };
                    setShopBanners(next);
                  }} />
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" className="form-control" value={banner.title} onChange={(e) => {
                    const next = [...shopBanners];
                    next[i] = { ...next[i], title: e.target.value };
                    setShopBanners(next);
                  }} />
                </div>
                <div className="form-group">
                  <label>Banner Image</label>
                  <input type="file" className="form-control" onChange={(e) => uploadImage(e, (url) => {
                    const next = [...shopBanners];
                    next[i] = { ...next[i], img: url };
                    setShopBanners(next);
                  })} />
                </div>
              </div>
              <div style={{ width: '200px', height: '120px', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {banner.img ? <img src={banner.img} alt="Shop Banner Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} /> : 'No Image'}
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: '24px' }}>
          <h3>About Section</h3>
          <p className="text-muted">The "limited edition collaborations" section content.</p>
          <hr style={{ margin: '15px 0' }} />

          <div className="form-group">
            <label>Subtitle</label>
            <input type="text" className="form-control" value={aboutSection.subtitle} onChange={(e) => setAboutSection({ ...aboutSection, subtitle: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input type="text" className="form-control" value={aboutSection.title} onChange={(e) => setAboutSection({ ...aboutSection, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" rows={4} value={aboutSection.description} onChange={(e) => setAboutSection({ ...aboutSection, description: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Main Image</label>
              <input type="file" className="form-control" onChange={(e) => uploadImage(e, (url) => setAboutSection((prev) => ({ ...prev, mainImg: url })))} />
              {aboutSection.mainImg && <img src={aboutSection.mainImg} alt="Main Preview" style={{ maxWidth: '150px', marginTop: '10px' }} />}
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Floating Image</label>
              <input type="file" className="form-control" onChange={(e) => uploadImage(e, (url) => setAboutSection((prev) => ({ ...prev, floatingImg: url })))} />
              {aboutSection.floatingImg && <img src={aboutSection.floatingImg} alt="Floating Preview" style={{ maxWidth: '150px', marginTop: '10px' }} />}
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: '24px' }}>
          <h3>Collection Banner</h3>
          <p className="text-muted">The "Our finest jewelry" split banner section.</p>
          <hr style={{ margin: '15px 0' }} />

          <div className="form-group">
            <label>Title</label>
            <input type="text" className="form-control" value={collectionBanner.title} onChange={(e) => setCollectionBanner({ ...collectionBanner, title: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Left Image</label>
              <input type="file" className="form-control" onChange={(e) => uploadImage(e, (url) => setCollectionBanner((prev) => ({ ...prev, leftImg: url })))} />
              {collectionBanner.leftImg && <img src={collectionBanner.leftImg} alt="Left Preview" style={{ maxWidth: '150px', marginTop: '10px' }} />}
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Right Image</label>
              <input type="file" className="form-control" onChange={(e) => uploadImage(e, (url) => setCollectionBanner((prev) => ({ ...prev, rightImg: url })))} />
              {collectionBanner.rightImg && <img src={collectionBanner.rightImg} alt="Right Preview" style={{ maxWidth: '150px', marginTop: '10px' }} />}
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: '24px' }}>
          <h3>Brand Logos</h3>
          <p className="text-muted">Logos displayed in the brand slider.</p>
          <hr style={{ margin: '15px 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {brands.map((logoUrl, i) => (
              <div key={i} style={{ padding: '15px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <div style={{ width: '100%', height: '80px', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  {logoUrl ? <img src={logoUrl} alt={`Brand ${i + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : `Logo ${i + 1}`}
                </div>
                <input type="file" className="form-control" onChange={(e) => uploadImage(e, (url) => {
                  const next = [...brands];
                  next[i] = url;
                  setBrands(next);
                })} />
                <button className="btn-secondary" style={{ marginTop: '10px', width: '100%' }} onClick={() => setBrands(brands.filter((_, idx) => idx !== i))}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button className="btn-secondary" style={{ marginTop: '15px' }} onClick={() => setBrands([...brands, ''])}>
            + Add Another Logo
          </button>
        </div>

        <div className="card" style={{ marginTop: '24px' }}>
          <h3>Feature Highlights</h3>
          <p className="text-muted">The 4-item strip (Free Delivery, Return & Refund, etc.) below the hero banners.</p>
          <hr style={{ margin: '15px 0' }} />

          {featureItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Title</label>
                <input type="text" className="form-control" value={item.title} onChange={(e) => {
                  const next = [...featureItems];
                  next[i] = { ...next[i], title: e.target.value };
                  setFeatureItems(next);
                }} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Subtitle</label>
                <input type="text" className="form-control" value={item.subtitle} onChange={(e) => {
                  const next = [...featureItems];
                  next[i] = { ...next[i], subtitle: e.target.value };
                  setFeatureItems(next);
                }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: '24px' }}>
          <h3>Footer Logo</h3>
          <p className="text-muted">Logo shown in the site footer.</p>
          <hr style={{ margin: '15px 0' }} />

          <div className="form-group">
            <label>Footer Logo Image</label>
            <input type="file" className="form-control" onChange={(e) => uploadImage(e, (url) => setFooterLogo(url))} />
            {footerLogo && <img src={footerLogo} alt="Footer Logo Preview" style={{ maxWidth: '150px', marginTop: '10px', background: '#020202', padding: '10px' }} />}
          </div>
        </div>

        <div className="card" style={{ marginTop: '24px' }}>
          <h3>CSR Page Photos</h3>
          <p className="text-muted">Images shown on the CSR (Corporate Social Responsibility) page.</p>
          <hr style={{ margin: '15px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {csrImages.map((imgUrl, i) => (
              <div key={i} style={{ padding: '15px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <div style={{ width: '100%', height: '120px', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  {imgUrl ? <img src={imgUrl} alt={`CSR ${i + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} /> : `Photo ${i + 1}`}
                </div>
                <input type="file" className="form-control" onChange={(e) => uploadImage(e, (url) => {
                  const next = [...csrImages];
                  next[i] = url;
                  setCsrImages(next);
                })} />
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: '24px' }}>
          <h3>Expertise Page Photos</h3>
          <p className="text-muted">Images shown on the Expertise page.</p>
          <hr style={{ margin: '15px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {expertiseImages.map((imgUrl, i) => (
              <div key={i} style={{ padding: '15px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <div style={{ width: '100%', height: '120px', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  {imgUrl ? <img src={imgUrl} alt={`Expertise ${i + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} /> : `Photo ${i + 1}`}
                </div>
                <input type="file" className="form-control" onChange={(e) => uploadImage(e, (url) => {
                  const next = [...expertiseImages];
                  next[i] = url;
                  setExpertiseImages(next);
                })} />
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: '24px' }}>
          <h3>Care Instructions Page Photos</h3>
          <p className="text-muted">Images shown on the Care Instructions page.</p>
          <hr style={{ margin: '15px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {careInstructionsImages.map((imgUrl, i) => (
              <div key={i} style={{ padding: '15px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <div style={{ width: '100%', height: '120px', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  {imgUrl ? <img src={imgUrl} alt={`Care Instructions ${i + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} /> : `Photo ${i + 1}`}
                </div>
                <input type="file" className="form-control" onChange={(e) => uploadImage(e, (url) => {
                  const next = [...careInstructionsImages];
                  next[i] = url;
                  setCareInstructionsImages(next);
                })} />
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: '24px' }}>
          <h3>Our Services — Central Image</h3>
          <p className="text-muted">The center photo displayed in the &quot;Where Trust Meets Timeless Elegance&quot; grid on the homepage.</p>
          <hr style={{ margin: '15px 0' }} />
          <div className="form-group">
            <label>Upload Center Image</label>
            <input type="file" className="form-control" onChange={(e) => uploadImage(e, (url) => setOurServicesImage(url))} />
          </div>
          {ourServicesImage && (
            <div style={{ marginTop: '15px' }}>
              <img src={ourServicesImage} alt="Our Services Preview" style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} />
              <br />
              <button className="btn-secondary" style={{ marginTop: '10px' }} onClick={() => setOurServicesImage('')}>Remove Image</button>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
