import React, { useState, useEffect } from 'react';

const RING_SIZES = [
  { mm: "41", us: "2", uk: "D", japan: "2", eu: "41" },
  { mm: "44", us: "3", uk: "F", japan: "4", eu: "44" },
  { mm: "45", us: "3 1/4", uk: "F ½", japan: "4 ½", eu: "45" },
  { mm: "46", us: "3 3/4", uk: "G ½", japan: "6", eu: "46" },
  { mm: "47", us: "4", uk: "H", japan: "7", eu: "47" },
  { mm: "48", us: "4 ½", uk: "I", japan: "8", eu: "48" },
  { mm: "49", us: "4 3/4", uk: "I ½", japan: "9", eu: "49" },
  { mm: "50", us: "5 1/4", uk: "J ½", japan: "10", eu: "50" },
  { mm: "51", us: "5 ½", uk: "K", japan: "11", eu: "51" },
  { mm: "52", us: "6", uk: "L", japan: "12", eu: "52" },
  { mm: "53", us: "6 ½", uk: "M", japan: "13", eu: "53" },
  { mm: "54", us: "6 3/4", uk: "M ½", japan: "14", eu: "54" },
  { mm: "55", us: "7 1/4", uk: "N ½", japan: "15", eu: "55" },
  { mm: "56", us: "7 ½", uk: "O", japan: "16", eu: "56" },
  { mm: "57", us: "8", uk: "P", japan: "17", eu: "57" },
  { mm: "58", us: "8 1/4", uk: "P ½", japan: "18", eu: "58" },
  { mm: "59", us: "8 3/4", uk: "Q ½", japan: "19", eu: "59" },
  { mm: "60", us: "9", uk: "R", japan: "20", eu: "60" },
  { mm: "61", us: "9 ½", uk: "S", japan: "21", eu: "61" },
  { mm: "62", us: "9 3/4", uk: "S ½", japan: "22", eu: "62" },
  { mm: "63", us: "10 1/4", uk: "T ½", japan: "23", eu: "63" },
  { mm: "64", us: "10 ½", uk: "U", japan: "24", eu: "64" },
  { mm: "65", us: "11", uk: "V", japan: "25", eu: "65" },
  { mm: "66", us: "11 1/4", uk: "V ½", japan: "26", eu: "66" },
  { mm: "67", us: "11 3/4", uk: "W ½", japan: "27", eu: "67" },
  { mm: "68", us: "12", uk: "X", japan: "28", eu: "68" },
  { mm: "69", us: "12 ½", uk: "Y", japan: "29", eu: "69" },
  { mm: "70", us: "13", uk: "Z", japan: "30", eu: "70" },
  { mm: "71", us: "13 1/4", uk: "Z ½", japan: "31", eu: "71" },
];

const BRACELET_SIZES = [
  { cm: "14", in: "5.5" },
  { cm: "14.5", in: "5.7" },
  { cm: "15", in: "5.9" },
  { cm: "15.5", in: "6.1" },
  { cm: "16", in: "6.3" },
  { cm: "16.5", in: "6.5" },
  { cm: "17", in: "6.7" },
  { cm: "17.5", in: "6.9" },
  { cm: "18", in: "7.1" },
  { cm: "18.5", in: "7.3" },
  { cm: "19", in: "7.5" },
  { cm: "19.5", in: "7.7" },
  { cm: "20", in: "7.9" }
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
    }, 15);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

const SizeGuideArea = () => {
  const [activeTab, setActiveTab] = useState("ring");

  return (
    <>
      <style>{`
        @keyframes fadeInSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-section {
          animation: fadeInSlideUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .size-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 30px;
          margin-bottom: 50px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border-radius: 8px;
          overflow: hidden;
        }
        .size-table th, .size-table td {
          padding: 16px 24px;
          text-align: center;
          border-bottom: 1px solid #e2e8f0;
        }
        .size-table th {
          background-color: #1e293b;
          color: #ffffff;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 16px;
        }
        .size-table tr:last-child td {
          border-bottom: none;
        }
        .size-table tbody tr:nth-of-type(even) {
          background-color: #f8fafc;
        }
        .size-table tbody tr:hover {
          background-color: #e2e8f0;
          transition: background-color 0.2s ease;
        }
        .instruction-card {
          background-color: #f8fafc;
          padding: 30px;
          border-radius: 8px;
          border-left: 4px solid #1e293b;
          margin-bottom: 30px;
        }
        .instruction-card h4 {
          color: #1e293b;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .instruction-card p, .instruction-card li {
          font-size: 18px;
          color: #475569;
          margin-bottom: 10px;
        }
        .instruction-card ul {
          padding-left: 20px;
        }
        .tab-btn {
          padding: 15px 40px;
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          border: none;
          background-color: transparent;
          color: #475569;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .tab-btn.active {
          color: #1e293b;
          border-bottom: 3px solid #1e293b;
        }
        .tab-btn:hover:not(.active) {
          color: #64748b;
        }
      `}</style>

      <section className="size-guide-area pt-100 pb-100" style={{ backgroundColor: '#ffffff', minHeight: '80vh' }}>
        <div className="container">
          {/* Header */}
          <div className="row mb-50">
            <div className="col-12 text-center">
              <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b', marginBottom: '15px' }}>
                Harene Size Guide
              </h2>
              <p style={{ fontSize: '18px', color: '#475569', maxWidth: '800px', margin: '0 auto' }}>
                Find your perfect fit. Follow our detailed instructions to accurately measure your ring and bracelet sizes from the comfort of your home.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="row mb-40">
            <div className="col-12 d-flex justify-content-center" style={{ gap: '20px', borderBottom: '1px solid #e2e8f0' }}>
              <button 
                className={`tab-btn ${activeTab === 'ring' ? 'active' : ''}`}
                onClick={() => setActiveTab('ring')}
              >
                Ring Size Guide
              </button>
              <button 
                className={`tab-btn ${activeTab === 'bracelet' ? 'active' : ''}`}
                onClick={() => setActiveTab('bracelet')}
              >
                Bracelet Size Guide
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="row justify-content-center" key={activeTab}>
            <div className="col-lg-10">
              
              {activeTab === 'ring' && (
                <div>
                  <div className="mb-4" style={{ minHeight: '40px' }}>
                    <h3 style={{ fontSize: '28px', color: '#1e293b', fontWeight: 'bold' }}>
                      <TypewriterText text="Ring Size Chart Instructions" />
                    </h3>
                  </div>
                  
                  <div className="row fade-in-section" style={{ animationDelay: '0.4s' }}>
                    <div className="col-md-6">
                      <div className="instruction-card h-100">
                        <h4>🖨️ Print Instructions</h4>
                        <ul>
                          <li>Print this guide on a full US Letter size (8½ × 11 inches) page.</li>
                          <li><strong>Scale to 100%</strong> to ensure accuracy.</li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="instruction-card h-100">
                        <h4>📏 Check Printing Accuracy</h4>
                        <p>Place a standard credit card on the line below. It should match the size of the printed line perfectly.</p>
                        <div style={{ padding: '15px', border: '2px dashed #94a3b8', textAlign: 'center', marginTop: '15px', backgroundColor: '#ffffff', borderRadius: '4px' }}>
                          <span style={{ fontSize: '14px', color: '#64748b', letterSpacing: '2px', fontWeight: 'bold' }}>PLACE CREDIT CARD HERE</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="instruction-card fade-in-section" style={{ animationDelay: '0.6s' }}>
                    <h4>💍 Finding Your Ring Size</h4>
                    <ul>
                      <li>Use an existing ring that fits you well.</li>
                      <li>Match the inside of that ring with one of the circles on a printed chart or measure its diameter in MM.</li>
                      <li>If your ideal fit falls between two sizes, Harene recommends choosing the <strong>larger size</strong>.</li>
                    </ul>
                  </div>

                  <div className="fade-in-section" style={{ animationDelay: '0.8s' }}>
                    <h4 style={{ fontSize: '24px', color: '#1e293b', fontWeight: 'bold', marginTop: '40px', marginBottom: '20px' }}>International Ring Size Conversion Chart</h4>
                    <div className="table-responsive">
                      <table className="size-table">
                        <thead>
                          <tr>
                            <th>US</th>
                            <th>UK</th>
                            <th>JAPAN</th>
                            <th>EU</th>
                            <th>MM</th>
                          </tr>
                        </thead>
                        <tbody>
                          {RING_SIZES.map((size, idx) => (
                            <tr key={idx}>
                              <td style={{ fontWeight: 'bold', color: '#1e293b' }}>{size.us}</td>
                              <td>{size.uk}</td>
                              <td>{size.japan}</td>
                              <td>{size.eu}</td>
                              <td>{size.mm}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'bracelet' && (
                <div>
                  <div className="mb-4" style={{ minHeight: '40px' }}>
                    <h3 style={{ fontSize: '28px', color: '#1e293b', fontWeight: 'bold' }}>
                      <TypewriterText text="Bracelet Size Chart Instructions" />
                    </h3>
                  </div>

                  <div className="row fade-in-section" style={{ animationDelay: '0.4s' }}>
                    <div className="col-md-6">
                      <div className="instruction-card h-100">
                        <h4>📏 Option 1: Using a Measuring Tape</h4>
                        <ul>
                          <li>Wrap a soft measuring tape around your wrist just below the wrist bone (where you would normally wear a bracelet).</li>
                          <li>Note the measurement in inches or centimeters.</li>
                          <li>Add <strong>½ inch (1.3 cm)</strong> for a snug fit or <strong>1 inch (2.5 cm)</strong> for a looser fit.</li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="instruction-card h-100">
                        <h4>✂️ Option 2: Using String or Paper</h4>
                        <ul>
                          <li>Wrap a string or strip of paper around your wrist.</li>
                          <li>Mark where it overlaps.</li>
                          <li>Measure the length with a ruler to find your wrist size.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="fade-in-section" style={{ animationDelay: '0.6s' }}>
                    <h4 style={{ fontSize: '24px', color: '#1e293b', fontWeight: 'bold', marginTop: '40px', marginBottom: '20px' }}>Bracelet Size Conversion Chart</h4>
                    <div className="table-responsive">
                      <table className="size-table" style={{ maxWidth: '600px', margin: '30px auto 50px auto' }}>
                        <thead>
                          <tr>
                            <th>Centimeters (CM)</th>
                            <th>Inches (IN)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {BRACELET_SIZES.map((size, idx) => (
                            <tr key={idx}>
                              <td style={{ fontWeight: 'bold', color: '#1e293b' }}>{size.cm}</td>
                              <td>{size.in}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Assistance Section */}
              <div className="fade-in-section" style={{ animationDelay: '0.9s', textAlign: 'center', marginTop: '30px', padding: '30px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '22px', color: '#1e293b', fontWeight: 'bold', marginBottom: '15px' }}>Need Assistance?</h4>
                <p style={{ fontSize: '18px', color: '#475569', marginBottom: '15px' }}>If you have any questions about sizing or need personalized assistance, please contact Harene:</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>📞</span>
                    <a href="tel:+85269731885" style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', textDecoration: 'none' }}>+852-69731885</a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>✉️</span>
                    <a href="mailto:vipul@vndiamonds.com" style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', textDecoration: 'none' }}>vipul@vndiamonds.com</a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SizeGuideArea;
