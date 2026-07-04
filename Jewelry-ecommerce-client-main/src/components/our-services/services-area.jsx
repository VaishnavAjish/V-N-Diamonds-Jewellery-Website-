import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Lottie from 'lottie-react';
import diamondAnimationData from './diamond-animation.json';
import engravingAnimationData from './engraving-animation.json';
import consultationAnimationData from './consultation-animation.json';
import nofakesAnimationData from './nofakes-animation.json';
import necklaceAnimationData from './necklace-animation.json';

// SVG Icons matching the requested aesthetic
const NecklaceIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#0F2239" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9z" opacity="0.3"></path>
    <path d="M12 21a9 9 0 0 1-9-9"></path>
    <path d="M12 16l-3-4h6z"></path>
    <circle cx="12" cy="7" r="1"></circle>
  </svg>
);

const CertificateIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#0F2239" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="M9 12l2 2 4-4"></path>
  </svg>
);

const ConsultationIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#0F2239" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 6.1H3v10.8h2.2v4.5l4.5-4.5H17V6.1z"></path>
    <path d="M7 11.5h6"></path>
    <path d="M7 8.5h4"></path>
    <path d="M21 11v6.8h-2.2v4.5l-4.5-4.5H11"></path>
  </svg>
);

const EngravingIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#0F2239" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);

const DiamondIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#0F2239" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.7 10.3l9.3 11.4 9.3-11.4-3.1-8-6.2 0-6.2 0z"></path>
    <path d="M2.7 10.3l18.6 0"></path>
    <path d="M12 21.7l0-11.4"></path>
    <path d="M12 21.7l6.2-11.4-3.1-8"></path>
    <path d="M12 21.7l-6.2-11.4 3.1-8"></path>
  </svg>
);

const ServicesArea = () => {
  const [storefrontSettings, setStorefrontSettings] = useState(null);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/api/settings/storefront')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStorefrontSettings(data.data);
      })
      .catch(err => console.error("Failed to load settings:", err));
  }, []);

  const centralImage = storefrontSettings?.ourServicesImage || '/assets/img/slider/4/ring_and_earring.png';

  const cardStyle = {
    background: '#FAFAFA',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    height: '260px',
    border: '1px solid #f0f0f0'
  };

  const textStyle = {
    marginTop: '20px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#333',
    maxWidth: '220px'
  };

  return (
    <section className="services-area pt-80 pb-80" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="container">

        {/* Header Section */}
        <div className="row justify-content-center mb-50">
          <div className="col-xl-8 col-lg-10 text-center">
            <h2 style={{ fontSize: '36px', fontWeight: '400', color: '#0F2239', marginBottom: '15px' }}>
              Where Trust Meets Timeless Elegance
            </h2>
            <p style={{ fontSize: '16px', color: '#666' }}>
              Trusted diamonds and gemstones backed by our No Fakes Pledge and personalized services.
            </p>
          </div>
        </div>

        {/* Grid Section */}
        <div className="services-grid">

          {/* Row 1, Col 1 */}
          <div className="service-card" style={cardStyle}>
            <div style={{ width: 110, height: 110 }}>
              <Lottie animationData={necklaceAnimationData} loop={true} style={{ width: '100%', height: '100%' }} />
            </div>
            <span style={textStyle}>Diamonds, Gemstones & Jewellery all under one roof</span>
          </div>

          {/* Row 1, Col 2 */}
          <div className="service-card" style={cardStyle}>
            <div style={{ width: 110, height: 110 }}>
              <Lottie animationData={nofakesAnimationData} loop={true} style={{ width: '100%', height: '100%' }} />
            </div>
            <span style={textStyle}>No Fakes Pledge</span>
          </div>

          {/* Row 1, Col 3 */}
          <div className="service-card" style={cardStyle}>
            <div style={{ width: 110, height: 110 }}>
              <Lottie animationData={consultationAnimationData} loop={true} style={{ width: '100%', height: '100%' }} />
            </div>
            <span style={textStyle}>Free Consultation</span>
          </div>

          {/* Row 2, Col 1 */}
          <div className="service-card" style={cardStyle}>
            <div style={{ width: 115, height: 115 }}>
              <Lottie animationData={engravingAnimationData} loop={true} style={{ width: '100%', height: '100%' }} />
            </div>
            <span style={textStyle}>Free Engraving</span>
          </div>

          {/* Row 2, Col 2 - Image Cell */}
          <div className="service-image-cell" style={{ width: '100%', height: '260px', position: 'relative', overflow: 'hidden' }}>
            <img
              src={centralImage}
              alt="Our Services"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Row 2, Col 3 */}
          <div className="service-card" style={cardStyle}>
            <div style={{ width: 110, height: 110 }}>
              <Lottie animationData={diamondAnimationData} loop={true} style={{ width: '100%', height: '100%' }} />
            </div>
            <span style={textStyle}>Diamond Upgrade</span>
          </div>

        </div>
      </div>

      <style jsx>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 991px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 767px) {
          .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default ServicesArea;
