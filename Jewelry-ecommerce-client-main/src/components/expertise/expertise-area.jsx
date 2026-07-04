import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const DEFAULT_EXPERTISE_IMAGES = [
  "https://vipulmaheshwari.sites2.digju.in/wp-content/uploads/2025/12/Small-Ruby-Rosecut-Diamond-Bracelet-1-e1765870431249.jpg",
  "/assets/img/about/about-1.jpg",
  "/assets/img/about/about-2.jpg",
  "https://images.unsplash.com/photo-1617317376997-8748e6862c01?q=80&w=800&auto=format&fit=crop",
];

const ExpertiseArea = () => {
  const containerRef = useRef(null);
  const [images, setImages] = useState(DEFAULT_EXPERTISE_IMAGES);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/api/settings/storefront')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.expertiseImages && data.data.expertiseImages.length > 0) {
          setImages(prev => prev.map((img, i) => data.data.expertiseImages[i] || img));
        }
      })
      .catch(e => console.error("Failed to load Expertise settings", e));
  }, []);

  useGSAP(() => {
    // 1. Hero Section (On Load)
    gsap.fromTo('.expertise-main-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    gsap.fromTo('.expertise-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 });

    // 2. Global Sourcing Section
    gsap.fromTo('.sourcing-left', 
      { opacity: 0, x: -50 },
      { scrollTrigger: { trigger: '.sourcing-row', start: 'top 85%' }, opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    );
    gsap.fromTo('.sourcing-right', 
      { opacity: 0, x: 50 },
      { scrollTrigger: { trigger: '.sourcing-row', start: 'top 85%' }, opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    );

    // 3. Three Grading Cards
    gsap.fromTo('.three-cards-col', 
      { opacity: 0, y: 50 },
      { scrollTrigger: { trigger: '.three-cards-row', start: 'top 85%' }, opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.2 }
    );

    // 4. Designing & Craftsmanship
    gsap.fromTo('.designing-left', 
      { opacity: 0, scale: 0.9 },
      { scrollTrigger: { trigger: '.designing-row', start: 'top 85%' }, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
    );
    gsap.fromTo('.designing-right li', 
      { opacity: 0, x: 30 },
      { scrollTrigger: { trigger: '.designing-row', start: 'top 85%' }, opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', stagger: 0.2 }
    );

    // 5. Production Excellence
    gsap.fromTo('.production-left', 
      { opacity: 0, y: 40 },
      { scrollTrigger: { trigger: '.production-row', start: 'top 85%' }, opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    gsap.fromTo('.production-right', 
      { opacity: 0, scale: 0.95 },
      { scrollTrigger: { trigger: '.production-row', start: 'top 85%' }, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );

    // 6. After-Sales Service
    gsap.fromTo('.after-sales-title', 
      { opacity: 0, y: 30 },
      { scrollTrigger: { trigger: '.after-sales-row', start: 'top 90%' }, opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    gsap.fromTo('.service-card-wrapper', 
      { opacity: 0, y: 40 },
      { scrollTrigger: { trigger: '.after-sales-row', start: 'top 85%' }, opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15 }
    );

  }, { scope: containerRef });

  return (
    <>
      <section className="expertise-area pt-120 pb-120" ref={containerRef}>
        <div className="container">
          {/* Header */}
          <div className="row mb-70">
            <div className="col-12 text-center">
              <h2 className="expertise-main-title mb-20" style={{ fontSize: '36px', fontWeight: 'bold', color: '#0f172a' }}>Expertise You Can Treasure</h2>
              <p className="expertise-subtitle" style={{ fontSize: '18px', color: '#475569', maxWidth: '800px', margin: '0 auto' }}>
                At Harene, expertise is more than a word — it’s a legacy of trust, precision, and craftsmanship.
              </p>
            </div>
          </div>

          {/* Global Sourcing */}
          <div className="row align-items-center mb-100 sourcing-row">
            <div className="col-lg-6 mb-40 mb-lg-0 sourcing-left">
              <h3 className="section-title mb-20" style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>Global Sourcing</h3>
              <p className="mb-30" style={{ fontSize: '16px', color: '#475569', lineHeight: '1.7', paddingRight: '20px' }}>
                We source the world’s most exquisite diamonds and gemstones directly from their origins, ensuring authenticity and unmatched quality.
              </p>
              
              <div className="sourcing-details" style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h4 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '15px' }}>Diamonds</h4>
                <p style={{ fontSize: '15px', color: '#475569', marginBottom: '25px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                  <a href="https://www.google.com/maps/search/jewelry+stores+in+Mumbai" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} className="location-link">
                    <i className="fa-regular fa-gem" style={{ color: '#cd9a5b', transition: 'transform 0.2s' }}></i> <span style={{fontWeight: 500, transition: 'color 0.2s'}}>Mumbai</span>
                  </a>
                  <a href="https://www.google.com/maps/search/jewelry+stores+in+Surat" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} className="location-link">
                    <i className="fa-regular fa-gem" style={{ color: '#cd9a5b', transition: 'transform 0.2s' }}></i> <span style={{fontWeight: 500, transition: 'color 0.2s'}}>Surat</span>
                  </a>
                  <a href="https://www.google.com/maps/search/jewelry+stores+in+Hong+Kong" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} className="location-link">
                    <i className="fa-regular fa-gem" style={{ color: '#cd9a5b', transition: 'transform 0.2s' }}></i> <span style={{fontWeight: 500, transition: 'color 0.2s'}}>Hong Kong</span>
                  </a>
                  <a href="https://www.google.com/maps/search/jewelry+stores+in+Seoul" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} className="location-link">
                    <i className="fa-regular fa-gem" style={{ color: '#cd9a5b', transition: 'transform 0.2s' }}></i> <span style={{fontWeight: 500, transition: 'color 0.2s'}}>Seoul</span>
                  </a>
                  <a href="https://www.google.com/maps/search/jewelry+stores+in+Belgium" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} className="location-link">
                    <i className="fa-regular fa-gem" style={{ color: '#cd9a5b', transition: 'transform 0.2s' }}></i> <span style={{fontWeight: 500, transition: 'color 0.2s'}}>Belgium</span>
                  </a>
                  <a href="https://www.google.com/maps/search/jewelry+stores+in+USA" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} className="location-link">
                    <i className="fa-regular fa-gem" style={{ color: '#cd9a5b', transition: 'transform 0.2s' }}></i> <span style={{fontWeight: 500, transition: 'color 0.2s'}}>USA</span>
                  </a>
                </p>

                <h4 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '15px' }}>Other Gemstones</h4>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: '#475569', fontSize: '15px', lineHeight: '2' }}>
                  <li><strong style={{color: '#0f172a'}}>Rubies</strong> — Myanmar (Burma), Mozambique, Thailand</li>
                  <li><strong style={{color: '#0f172a'}}>Emeralds</strong> — Colombia, Zambia</li>
                  <li><strong style={{color: '#0f172a'}}>Sapphires</strong> — Kashmir, Myanmar (Burma), Sri Lanka (Ceylon), Madagascar</li>
                  <li><strong style={{color: '#0f172a'}}>Spinels</strong> — Burma, Vietnam, Tanzania</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6 sourcing-right">
              <div className="img-wrapper rounded-4 overflow-hidden shadow" style={{ backgroundColor: '#f1f1f1' }}>
                <img src={images[0]} alt="Global Sourcing Bracelet" className="img-fluid w-100" style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </div>

          {/* Three Cards */}
          <div className="row mb-100 g-4 three-cards-row">
            <div className="col-lg-4 three-cards-col">
              <div className="info-card text-center h-100 p-5 rounded-4 shadow-sm d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
                <div className="icon mb-4" style={{ fontSize: '40px', color: '#1e293b' }}>
                  <i className="fa-solid fa-certificate"></i>
                </div>
                <h4 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>Grading Reports</h4>
                <p style={{ fontSize: '15px', color: '#475569', marginTop: '15px', lineHeight: '1.6' }}>
                  Every stone is accompanied by trusted grading reports, offering transparency and assurance of quality.
                </p>
              </div>
            </div>
            <div className="col-lg-4 three-cards-col">
              <div className="img-card h-100 rounded-4 overflow-hidden shadow-sm">
                <img src={images[1]} alt="Model showcasing jewelry" className="img-fluid w-100 h-100" style={{ objectFit: 'cover', minHeight: '300px' }} />
              </div>
            </div>
            <div className="col-lg-4 three-cards-col">
              <div className="info-card text-center h-100 p-5 rounded-4 shadow-sm d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
                <div className="icon mb-4" style={{ fontSize: '40px', color: '#1e293b' }}>
                  <i className="fa-solid fa-check-circle"></i>
                </div>
                <h4 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>Quality Control</h4>
                <p style={{ fontSize: '15px', color: '#475569', marginTop: '15px', lineHeight: '1.6' }}>
                  From rough stones to finished product, every step is rigorously monitored to secure perfection.
                </p>
              </div>
            </div>
          </div>

          {/* Designing & Craftsmanship */}
          <div className="row align-items-center mb-100 flex-column-reverse flex-lg-row designing-row">
            <div className="col-lg-6 mt-40 mt-lg-0 designing-left">
               <div className="img-wrapper rounded-4 overflow-hidden shadow">
                 <img src={images[2]} alt="Jewelry Sketching" className="img-fluid w-100" style={{ objectFit: 'cover', maxHeight: '500px' }} />
               </div>
            </div>
            <div className="col-lg-6 ps-lg-5 designing-right">
              <h3 className="section-title mb-40" style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>Designing & Craftsmanship</h3>
              <ul style={{ listStyleType: 'none', paddingLeft: '0', color: '#475569' }}>
                <li style={{ position: 'relative', paddingLeft: '24px', marginBottom: '35px' }}>
                  <span style={{ position: 'absolute', left: 0, top: '8px', width: '8px', height: '8px', backgroundColor: '#cd9a5b', borderRadius: '50%' }}></span>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>Stone-Based Designing</h4>
                  <p style={{ fontSize: '16px', margin: 0, lineHeight: '1.7' }}>"Our designs highlight the natural beauty of each stone, ensuring brilliance at its fullest."</p>
                </li>
                <li style={{ position: 'relative', paddingLeft: '24px' }}>
                  <span style={{ position: 'absolute', left: 0, top: '8px', width: '8px', height: '8px', backgroundColor: '#cd9a5b', borderRadius: '50%' }}></span>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>Craftsmanship</h4>
                  <p style={{ fontSize: '16px', margin: 0, lineHeight: '1.7' }}>"Blending traditional artistry with modern precision, our master craftsmen create flawless elegance."</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Production Excellence */}
          <div className="row align-items-center mb-100 production-row">
             <div className="col-lg-6 mb-40 mb-lg-0 pe-lg-5 production-left">
              <h3 className="section-title mb-25" style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>Production Excellence</h3>
              <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.8' }}>
                At Harene, production is where precision meets passion. Our skilled artisans and state-of-the-art facilities transform responsibly sourced stones into finished masterpieces. Through careful planning, meticulous setting, and exacting quality checks, every piece is finished, polished, and inspected to ensure it meets our highest standards of beauty, durability, and value.
              </p>
             </div>
             <div className="col-lg-6 production-right">
                <div className="img-wrapper rounded-4 overflow-hidden shadow">
                  <img src={images[3]} alt="Jewelry Crafting Process" className="img-fluid w-100" style={{ objectFit: 'cover', maxHeight: '500px' }} />
                </div>
             </div>
          </div>

          {/* After-Sales Service */}
          <div className="row after-sales-row">
            <div className="col-12 text-center mb-50 after-sales-title">
              <h3 className="section-title mb-15" style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>After-Sales Service</h3>
              <p style={{ fontSize: '16px', color: '#475569' }}>
                Our relationship doesn't end with a purchase — we provide lifelong care for your jewellery.
              </p>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-30 service-card-wrapper">
               <div className="service-card text-center p-4 rounded-4 shadow-sm h-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
                 <div className="icon mb-3" style={{ fontSize: '32px', color: '#1e293b' }}>
                   <i className="fa-solid fa-star"></i>
                 </div>
                 <h5 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Free Cleaning</h5>
               </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-30 service-card-wrapper">
               <div className="service-card text-center p-4 rounded-4 shadow-sm h-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
                 <div className="icon mb-3" style={{ fontSize: '32px', color: '#1e293b' }}>
                   <i className="fa-solid fa-shield-alt"></i>
                 </div>
                 <h5 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Regular Check-Ups</h5>
               </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-30 service-card-wrapper">
               <div className="service-card text-center p-4 rounded-4 shadow-sm h-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
                 <div className="icon mb-3" style={{ fontSize: '32px', color: '#1e293b' }}>
                   <i className="fa-solid fa-expand"></i>
                 </div>
                 <h5 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Re-Sizing</h5>
               </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-30 service-card-wrapper">
               <div className="service-card text-center p-4 rounded-4 shadow-sm h-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
                 <div className="icon mb-3" style={{ fontSize: '32px', color: '#1e293b' }}>
                   <i className="fa-solid fa-magic"></i>
                 </div>
                 <h5 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Re-Polishing</h5>
               </div>
            </div>
          </div>
          
        </div>
      </section>

      <style>{`
        .expertise-area { background-color: #fdfdfd; font-family: 'Inter', sans-serif; }
        .info-card { transition: all 0.3s ease; cursor: default; }
        .info-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important; }
        .service-card { transition: all 0.3s ease; cursor: pointer; }
        .service-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important; border-color: #cbd5e1 !important; }
        
        .location-link:hover span { color: #cd9a5b; }
        .location-link:hover i { transform: scale(1.2); }
        
        /* Animated Logos / Icons */
        .icon i { 
          display: inline-block; 
          transition: all 0.3s ease; 
        }
        @keyframes logoAnimate {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.15); color: #cd9a5b; }
        }
        .info-card:hover .icon i, .service-card:hover .icon i {
          animation: logoAnimate 1s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default ExpertiseArea;
