import React from 'react';

const OurValuesArea = () => {
  return (
    <>
      <style>{`
        .values-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 100px 20px;
          background-color: #fdfdfd;
        }
        
        .values-title {
          text-align: center;
          font-size: 54px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 15px;
          letter-spacing: -1.5px;
          opacity: 0;
          animation: fadeUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .values-subtitle {
          text-align: center;
          font-size: 26px;
          font-weight: 500;
          color: #cd9a5b;
          margin-bottom: 70px;
          font-style: italic;
          opacity: 0;
          animation: fadeUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
        }
        
        .values-intro {
          max-width: 900px;
          margin: 0 auto 70px auto;
        }

        .values-paragraph {
          font-size: 20px;
          line-height: 1.9;
          color: #334155;
          margin-bottom: 25px;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          position: relative;
        }

        .values-intro .values-paragraph:nth-child(1) { animation-delay: 0.5s; }
        .values-intro .values-paragraph:nth-child(2) { animation-delay: 0.7s; }
        .values-intro .values-paragraph:nth-child(3) { animation-delay: 0.9s; }
        .values-intro .values-paragraph:nth-child(4) { animation-delay: 1.1s; }
        
        /* Grid for the core value cards */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 35px;
          margin-bottom: 80px;
        }
        
        .value-card {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 45px 35px;
          box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.06);
          border: 1px solid rgba(226, 232, 240, 0.8);
          position: relative;
          opacity: 0;
          animation: fadeUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.12);
          border-color: #cd9a5b;
        }

        .value-card:nth-child(1) { animation-delay: 1.3s; }
        .value-card:nth-child(2) { animation-delay: 1.5s; }
        .value-card:nth-child(3) { animation-delay: 1.7s; }

        .value-card-icon {
          width: 60px;
          height: 60px;
          background-color: #f8fafc;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 25px;
          color: #cd9a5b;
          border: 1px solid #e2e8f0;
          transition: all 0.4s ease;
        }
        
        .value-card:hover .value-card-icon {
          background-color: #cd9a5b;
          color: #ffffff;
          border-color: #cd9a5b;
          transform: scale(1.1);
        }

        .value-card-title {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 18px;
        }

        .value-card-text {
          font-size: 17px;
          line-height: 1.8;
          color: #475569;
        }
        
        .values-footer {
          text-align: center;
          background: #f8fafc;
          padding: 50px 40px;
          border-radius: 20px;
          border-left: 6px solid #0f172a;
          opacity: 0;
          animation: fadeUp 1s cubic-bezier(0.4, 0, 0.2, 1) 2.0s forwards;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }

        .values-footer p {
          font-size: 22px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
          line-height: 1.7;
        }
        
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <section className="values-area" style={{ backgroundColor: '#fdfdfd' }}>
        <div className="values-container">
          <h1 className="values-title">Our Values</h1>
          <h3 className="values-subtitle">"Built on Trust, Shaped by Passion."</h3>

          <div className="values-intro">
            <p className="values-paragraph">
              Our Values come from our humble upbringing where right from childhood we were taught the basics of Truth, Integrity & Commitment. Good things in life never change, so did our Core Values.
            </p>
            <p className="values-paragraph">
              After being associated with the biggest names in the industry, we learnt to be respectful and the value of keeping promises.
            </p>
            <p className="values-paragraph">
              We are proud that our name brings respect, we are treated with the utmost sincerity and as a trustworthy member of this trade. Every individual working for HARENE carries those values and keeps them at the highest level.
            </p>
            <p className="values-paragraph">
              At HARENE, our values are the foundation upon which every masterpiece is crafted. Drawn from a humble upbringing, we uphold the timeless principles of truth, integrity, and commitment&mdash;values that never change and guide every decision we make.
            </p>
          </div>

          <div className="values-grid">
            {/* Card 1 */}
            <div className="value-card">
              <div className="value-card-icon"><i className="fas fa-balance-scale"></i></div>
              <h4 className="value-card-title">Truth, Integrity & Commitment</h4>
              <p className="value-card-text">
                From childhood lessons to our daily practice, honesty and honor are nonnegotiable. We promise transparency in sourcing, precision in craftsmanship, and unwavering dedication to your satisfaction.
              </p>
            </div>

            {/* Card 2 */}
            <div className="value-card">
              <div className="value-card-icon"><i className="fas fa-handshake"></i></div>
              <h4 className="value-card-title">Respect & Promise-Keeping</h4>
              <p className="value-card-text">
                Years alongside the industry's finest taught us the power of respect&mdash;both for our craft and the people we serve. Every promise is a pact; every commitment is kept. That's why clients know they can count on HARENE for honesty and follow-through.
              </p>
            </div>

            {/* Card 3 */}
            <div className="value-card">
              <div className="value-card-icon"><i className="fas fa-heart"></i></div>
              <h4 className="value-card-title">Trust & Sincerity</h4>
              <p className="value-card-text">
                Our reputation speaks volumes. When you choose HARENE, you choose a partner who treats you with the utmost sincerity and respect. Each team member carries these values in heart and practice, ensuring your experience is built on trust from first glance to final polish.
              </p>
            </div>
          </div>

          <div className="values-footer">
            <p>
              Every gem we set and every piece we create reflects these core values.<br />
              <span style={{ color: '#cd9a5b' }}>Experience the HARENE difference&mdash;where enduring principles meet extraordinary beauty.</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurValuesArea;
