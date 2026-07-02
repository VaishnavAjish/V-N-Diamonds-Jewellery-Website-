import React from 'react';

const OurStoryArea = () => {
  return (
    <>
      <style>{`
        .story-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 100px 20px;
          background-color: #fdfdfd;
        }
        
        .story-title {
          text-align: center;
          font-size: 54px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 15px;
          letter-spacing: -1.5px;
          opacity: 0;
          animation: fadeUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .story-subtitle {
          text-align: center;
          font-size: 26px;
          font-weight: 500;
          color: #cd9a5b;
          margin-bottom: 70px;
          font-style: italic;
          opacity: 0;
          animation: fadeUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
        }
        
        .story-content {
          /* Wrapper styles if needed */
        }
        
        .story-paragraph {
          font-size: 20px;
          line-height: 1.9;
          color: #334155;
          margin-bottom: 35px;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          position: relative;
        }

        .story-paragraph:nth-child(1) { animation-delay: 0.6s; }
        .story-paragraph:nth-child(2) { animation-delay: 0.9s; }
        .story-paragraph:nth-child(3) { animation-delay: 1.2s; }
        .story-paragraph:nth-child(4) { animation-delay: 1.5s; }
        
        .story-quote {
          margin-top: 80px;
          padding: 50px 40px;
          text-align: center;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          border-radius: 20px;
          font-size: 32px;
          font-weight: 700;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
          opacity: 0;
          animation: fadeUp 1s cubic-bezier(0.4, 0, 0.2, 1) 1.8s forwards;
          position: relative;
          overflow: hidden;
        }

        .story-quote::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
          background: #cd9a5b;
        }
        
        .story-quote span {
          color: #cd9a5b;
          display: block;
          margin-top: 10px;
          font-size: 28px;
          font-weight: 500;
          font-style: italic;
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

      <section className="story-area" style={{ backgroundColor: '#fdfdfd' }}>
        <div className="story-container">
          <h1 className="story-title">The Story of HARENE</h1>
          <h3 className="story-subtitle">"Shaping Dreams into Diamonds."</h3>

          <div className="story-content">
            <p className="story-paragraph">
              <strong style={{ color: '#0f172a', fontWeight: '800' }}>HARENE</strong> was born out of pure passion on April 2, 2012, when founders Vipul and Nidhi transformed their lifelong love for fine jewelry into a thriving business. From a modest beginning in the heart of Hong Kong, they brought together deep industry expertise, unwavering integrity, and a shared vision to offer something truly exceptional in the world of diamonds and gemstones.
            </p>

            <p className="story-paragraph">
              What began as a dream quickly evolved into a flourishing enterprise. Word spread fast &mdash; clients were drawn not just to the unmatched quality of our products, but to the personalized care and attention that defined every interaction. From Hong Kong to neighboring regions, HARENE became synonymous with trust, elegance, and excellence.
            </p>

            <p className="story-paragraph">
              Over the years, our founders have built strong relationships with some of the most respected names in the industry, always guided by high morals and a commitment to authenticity. Their reputation for honesty and craftsmanship earned admiration across the board &mdash; from seasoned collectors to first-time buyers.
            </p>

            <p className="story-paragraph">
              Today, HARENE proudly offers a curated selection of world-class diamonds, rare gemstones, and handcrafted jewelry. Each piece reflects our dedication to beauty, precision, and the timeless values that started it all.
            </p>
          </div>

          <div className="story-quote">
            Welcome to HARENE
            <span>where passion meets perfection.</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurStoryArea;
