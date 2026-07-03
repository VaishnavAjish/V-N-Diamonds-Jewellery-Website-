import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PrivacyPolicyModal from '@/components/common/PrivacyPolicyModal';
import TermsAndConditionsModal from '@/components/common/TermsAndConditionsModal';
import RefundReturnPolicyModal from '@/components/common/RefundReturnPolicyModal';
import ParticlesBackground from '@/components/common/ParticlesBackground';
// internal — use white logo for dark background
import logo from '@assets/img/logo/logo-white.png';

const FooterTwo = ({ settings, primary_style = false }) => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  return (
    <>
      <footer>
        <div
          className="tp-footer-area tp-footer-style-2 tp-footer-style-3 tp-footer-style-4 p-relative"
          style={{ backgroundColor: '#020202', color: '#fff', overflow: 'hidden' }}
        >
          {/* Particles / constellation background */}
          <ParticlesBackground id="tsparticles-footer2" />

          <div className="tp-footer-top pt-95 pb-40 p-relative z-index-1">
            <div className="container">
              <div className="row">

                {/* Column 1: Quick Links */}
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div className="tp-footer-widget mb-50">
                    <h4 className="tp-footer-widget-title" style={{ color: '#cd9a5b' }}>Quick Links</h4>
                    <div className="tp-footer-widget-content tp-footer-dark-theme-content">
                      <ul>
                        <li><Link href="/our-services">Our Services</Link></li>
                        <li><Link href="/csr">CSR</Link></li>
                        <li><Link href="/expertise">Expertise</Link></li>
                        <li><Link href="/care-instructions">Care Instructions</Link></li>
                        <li><Link href="/education">Education</Link></li>
                        <li><Link href="/contact">Contact Us</Link></li>
                        <li><Link href="/size-guide">Size Guide</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Column 2: Our Offerings */}
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div className="tp-footer-widget mb-50">
                    <h4 className="tp-footer-widget-title" style={{ color: '#cd9a5b' }}>Our Offerings</h4>
                    <div className="tp-footer-widget-content tp-footer-dark-theme-content">
                      <ul>
                        <li><Link href="/product-category/diamonds">Diamonds</Link></li>
                        <li><Link href="/product-category/fine-jewellery">Fine Jewellery</Link></li>
                        <li><Link href="/product-category/precious-gemstones">Precious Gemstones</Link></li>
                        <li><Link href="/product-category/rare-collectorsgemstones">Rare (Collector&apos;s)Gemstones</Link></li>
                        <li><Link href="/product-category/semi-precious-gemstones">Semi-Precious Gemstones</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Column 3: Contact Us */}
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div className="tp-footer-widget mb-50">
                    <h4 className="tp-footer-widget-title" style={{ color: '#cd9a5b' }}>Contact Us</h4>
                    <div className="tp-footer-widget-content tp-footer-dark-theme-content">
                      <div className="tp-footer-contact">
                        <div className="tp-footer-contact-item d-flex align-items-start" style={{ gap: '15px', marginBottom: '15px' }}>
                          <div className="tp-footer-contact-icon">
                            <span><i className="fas fa-phone-alt" style={{ color: '#cd9a5b', marginTop: '6px' }}></i></span>
                          </div>
                          <div className="tp-footer-contact-content">
                            <p style={{ margin: 0, lineHeight: '1.5' }}>
                              <a href="tel:+852-69731885">+852-69731885</a>
                            </p>
                          </div>
                        </div>
                        <div className="tp-footer-contact-item d-flex align-items-start" style={{ gap: '15px', marginBottom: '15px' }}>
                          <div className="tp-footer-contact-icon">
                            <span><i className="fas fa-envelope" style={{ color: '#cd9a5b', marginTop: '6px' }}></i></span>
                          </div>
                          <div className="tp-footer-contact-content">
                            <p style={{ margin: 0, lineHeight: '1.5' }}>
                              <a href="mailto:vipul@vndiamonds.com">vipul@vndiamonds.com</a>
                            </p>
                          </div>
                        </div>
                        <div className="tp-footer-contact-item d-flex align-items-start" style={{ gap: '15px', marginBottom: '15px' }}>
                          <div className="tp-footer-contact-icon">
                            <span><i className="fas fa-map-marker-alt" style={{ color: '#cd9a5b', marginTop: '6px' }}></i></span>
                          </div>
                          <div className="tp-footer-contact-content">
                            <p style={{ margin: 0, lineHeight: '1.5' }}>
                              <a href="https://www.google.com/maps/place/VN+Diamonds/@22.2981918,114.1721542,17z" target="_blank" rel="noreferrer">
                                Suite D, 25/F, No. 8 <br />Hart Avenue, Tsim Sha Tsui<br />Kowloon, Hong Kong
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 4: Logo & Info */}
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div className="tp-footer-widget mb-50">
                    <div className="tp-footer-logo mb-20">
                      <Link href="/">
                        <Image src={logo} alt="Harene logo" width={180} height={111} style={{ width: '150px', height: 'auto' }} />
                      </Link>
                    </div>
                    <h4 className="tp-footer-widget-title" style={{ fontSize: '18px', marginBottom: '15px', color: '#cd9a5b' }}>
                      The Perfect Present for Your Partner
                    </h4>
                    <div className="tp-footer-widget-content tp-footer-dark-theme-content">
                      <p style={{ marginBottom: '20px' }}>
                        <a href="#" onClick={(e) => { e.preventDefault(); setIsTermsModalOpen(true); }}>Terms &amp; Conditions</a> .<br />
                        <a href="#" onClick={(e) => { e.preventDefault(); setIsPrivacyModalOpen(true); }}>Privacy Policy</a> .<br />
                        <a href="#" onClick={(e) => { e.preventDefault(); setIsRefundModalOpen(true); }}>Refund &amp; Return Policy</a>
                      </p>
                      <div className="tp-footer-social-4 tp-footer-social">
                        <a href="https://www.facebook.com/vndiamonds/?locale=zh_HK" target="_blank" rel="noreferrer"
                          style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#cd9a5b' }}>
                          <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://www.instagram.com/harenejewels?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer"
                          style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#cd9a5b' }}>
                          <i className="fab fa-instagram"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="tp-footer-bottom p-relative z-index-1">
            <div className="container">
              <div className="tp-footer-bottom-wrapper">
                <div className="row align-items-center justify-content-between">
                  <div className="col-lg-6 col-md-12 text-center text-lg-start mb-3 mb-lg-0">
                    <div className="tp-footer-copyright">
                      <p style={{ color: '#aaa', fontSize: '12px', marginBottom: 0 }}>
                        Registration No: B-B-24-03-06490 for Category B Registrant (Section 53ZUP, Cap 615, LAWS OF HONG KONG)
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 text-center text-lg-end">
                    <div className="tp-footer-copyright">
                      <p style={{ color: '#aaa', marginBottom: 0 }}>
                        © Copyright {new Date().getFullYear()}. All Rights Reserved By{' '}
                        <span style={{ color: '#cd9a5b' }}>Harene.</span> Designed by{' '}
                        <span style={{ color: '#cd9a5b' }}>Nidhi IT</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
      <TermsAndConditionsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
      <RefundReturnPolicyModal isOpen={isRefundModalOpen} onClose={() => setIsRefundModalOpen(false)} />
    </>
  );
};

export default FooterTwo;
