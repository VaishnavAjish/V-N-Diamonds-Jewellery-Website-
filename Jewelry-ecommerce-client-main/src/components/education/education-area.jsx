import React, { useState, useEffect } from 'react';
import { GEMSTONE_DATA } from './education-data';

const TABS = [
  "Diamonds",
  "Citrines",
  "Aquamarines",
  "Amethysts",
  "Turquoises",
  "Tourmalines",
  "Tanzanites",
  "Sapphires",
  "Rubies",
  "Moonstones",
  "Kunzites",
  "Emeralds"
];

const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 15); // Adjust typing speed here

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

const EducationArea = () => {
  const [activeTab, setActiveTab] = useState("Diamonds");
  const currentData = GEMSTONE_DATA[activeTab];

  return (
    <>
      <style>{`
        @keyframes fadeInSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-section {
          animation: fadeInSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }
        
        /* Premium Tabs */
        .premium-tab-btn {
          background-color: transparent;
          color: #64748b;
          border: none;
          border-left: 3px solid transparent;
          padding: 16px 25px;
          text-align: left;
          font-weight: 600;
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          width: 100%;
          border-radius: 0 12px 12px 0;
          position: relative;
        }
        .premium-tab-btn:hover:not(.active) {
          background-color: #f8fafc;
          color: #1e293b;
          transform: translateX(5px);
        }
        .premium-tab-btn.active {
          background-color: #f1f5f9;
          color: #0f172a;
          border-left-color: #0f172a;
          font-weight: 700;
          box-shadow: 4px 4px 20px rgba(0,0,0,0.03);
          transform: translateX(8px);
        }

        /* Premium Content Card */
        .premium-content-card {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 20px 50px -12px rgba(15, 23, 42, 0.08);
          padding: 50px 60px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          position: relative;
          overflow: hidden;
        }
        .premium-content-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
          background: linear-gradient(90deg, #1e293b, #475569);
        }

        /* Section Hover Effect */
        .premium-section-block {
          padding: 30px;
          border-radius: 16px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          margin-bottom: 30px;
        }
        .premium-section-block:hover {
          background-color: #f8fafc;
          border-color: #e2e8f0;
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -10px rgba(15, 23, 42, 0.06);
        }
      `}</style>
      <section className="education-area pt-100 pb-100" style={{ backgroundColor: '#fdfdfd', minHeight: '80vh' }}>
        <div className="container">
          {/* Header */}
          <div className="row mb-50">
            <div className="col-12 text-center">
              <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#0f172a', marginBottom: '18px', letterSpacing: '-0.5px' }}>
                The Story, Science, and Symbolism of Fine Gemstones
              </h2>
              <p style={{ fontSize: '19px', color: '#475569', maxWidth: '850px', margin: '0 auto', lineHeight: '1.7' }}>
                A refined overview of the world's most treasured gemstones, their history, rarity, and timeless appeal.
              </p>
            </div>
          </div>

          <div className="row">
            {/* Sidebar Tabs */}
            <div className="col-lg-3 col-md-4 mb-40">
              <div className="d-flex flex-column" style={{ gap: '6px', position: 'sticky', top: '120px' }}>
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`premium-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="col-lg-9 col-md-8">
              <div style={{ paddingLeft: '10px' }} key={activeTab}>
                {currentData ? (
                  <div className="premium-content-card tab-content-area" style={{ color: '#334155', lineHeight: '1.9' }}>
                    <p style={{ fontSize: '20px', fontWeight: '500', marginBottom: '40px', minHeight: '80px', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '30px' }}>
                      <TypewriterText text={currentData.intro} />
                    </p>

                    {currentData.sections.map((section, idx) => (
                      <div key={idx} className="premium-section-block fade-in-section" style={{ animationDelay: `${(idx * 0.12) + 0.5}s` }}>
                        <h4 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '14px', letterSpacing: '-0.3px' }}>
                          <span style={{ fontSize: '32px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>{section.emoji}</span> {section.title}
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '18px' }}>
                          {section.items.map((item, itemIdx) => (
                            <li key={itemIdx} style={{ fontSize: '18px', color: '#334155', display: 'flex', gap: '10px' }}>
                              <span style={{ color: '#94a3b8', fontSize: '20px', lineHeight: '1.2' }}>•</span>
                              <div>
                                <strong style={{ color: '#0f172a', fontWeight: '700' }}>{item.label}:</strong> {item.text}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    <p className="fade-in-section" style={{ fontSize: '18px', marginTop: '30px', color: '#334155', backgroundColor: '#f8fafc', padding: '25px 30px', borderRadius: '12px', borderLeft: '5px solid #0f172a', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', animationDelay: `${(currentData.sections.length * 0.12) + 0.5}s` }}>
                      <strong style={{ color: '#0f172a', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '14px' }}>In short &mdash; </strong> {currentData.summary.replace('In short: ', '')}
                    </p>
                  </div>
                ) : (
                  <div className="premium-content-card tab-content-area" style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '100px 50px' }}>
                    <div className="text-center">
                      <h3 style={{ fontSize: '28px', color: '#cbd5e1', marginBottom: '15px', fontWeight: '700' }}>Information for {activeTab} coming soon.</h3>
                      <p style={{ fontSize: '18px', color: '#64748b' }}>Select another gemstone to view detailed information.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EducationArea;
