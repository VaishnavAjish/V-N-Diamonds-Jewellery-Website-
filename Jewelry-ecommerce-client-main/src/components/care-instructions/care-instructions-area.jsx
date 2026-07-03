import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CareInstructionsArea = () => {
  const containerRef = useRef();
  const [images, setImages] = useState([
    "/assets/img/about/about-1.jpg",
    "/assets/img/about/about-2.jpg",
    "/assets/img/slider/4/slider-3.png"
  ]);

  useEffect(() => {
    fetch('http://192.168.1.211:7000/api/settings/storefront')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.careInstructionsImages && data.data.careInstructionsImages.length > 0) {
          setImages(prev => [
            data.data.careInstructionsImages[0] || prev[0],
            data.data.careInstructionsImages[1] || prev[1],
            data.data.careInstructionsImages[2] || prev[2]
          ]);
        }
      })
      .catch(e => console.error("Failed to load Care Instructions settings", e));
  }, []);

  useGSAP(() => {
    // Reveal animations for images
    gsap.utils.toArray('.care-img-wrapper').forEach((img, i) => {
      gsap.fromTo(img, 
        { opacity: 0, scale: 0.9, y: 50 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: img,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    // Reveal animations for text content
    gsap.utils.toArray('.care-content').forEach((content, i) => {
      gsap.fromTo(content,
        { opacity: 0, x: i % 2 === 0 ? 50 : -50 },
        {
          opacity: 1, x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <>
      <section className="care-instructions-area" ref={containerRef} style={{ fontFamily: "'Inter', sans-serif" }}>
        
        {/* Jewellery Section */}
        <div className="care-section pt-100 pb-100" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-40 mb-lg-0">
                <div className="care-img-wrapper" style={{ paddingRight: '30px' }}>
                  <img src={images[0]} alt="Jewellery" style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="care-content" style={{ paddingLeft: '30px' }}>
                  <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '25px' }}>Jewellery</h3>
                  <p style={{ fontSize: '15px', color: '#475569', marginBottom: '25px', lineHeight: '1.8' }}>
                    Your Jewellery is precious and a piece of art. By taking a few precautions in using and maintaining it, you will be able to preserve its original beauty over time.
                  </p>
                  <ul className="care-list" style={{ paddingLeft: '20px', color: '#475569', fontSize: '15px', lineHeight: '1.8' }}>
                    <li style={{ marginBottom: '15px' }}>
                      Your jewellery should be cleaned regularly. You can use a very soft brush and soapy water to clean it, then rinse your piece with clean lukewarm water. Jewels with leather parts can be cleaned with a soft cloth. We recommend that you bring your jewels to a Harene Store annually, to have them checked, professionally cleaned and restored.
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                      Consider removing your jewellery before going to sleep, practicing any sport, washing your hands or using corrosive products. Avoid contact with Fragrance, alcohol, cosmetics, ammonia, chlorine and keep your pieces away from intense sources of heat and extreme temperature changes.
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                      Prevent damage or loss of your jewels by storing them individually in their original box or pouch after wearing them; contact with other jewellery pieces could cause scratches. Chains should be closed and laid flat to avoid their becoming tangling.
                    </li>
                    <li>
                      If your jewellery suffers a shock or hit, the stone setting may need to be checked. Avoid forcing clasps, joints and metal frames and be sure to check that the clasp and safety latch close properly. If you have any concerns, you should not wear your jewel until you have had it checked by an expert into Harene Office.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diamonds Section */}
        <div className="care-section pt-100 pb-100" style={{ backgroundColor: '#f9f9f9', overflow: 'hidden' }}>
          <div className="container">
            <div className="row align-items-center flex-column-reverse flex-lg-row">
              <div className="col-lg-6">
                <div className="care-content" style={{ paddingRight: '30px' }}>
                  <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '25px' }}>Diamonds</h3>
                  <p style={{ fontSize: '15px', color: '#475569', marginBottom: '25px', lineHeight: '1.8' }}>
                    Your diamond is one of nature's most enduring treasures. With the right care, it will maintain its brilliance and sparkle for generations.
                  </p>
                  <ul className="care-list" style={{ paddingLeft: '20px', color: '#475569', fontSize: '15px', lineHeight: '1.8' }}>
                    <li style={{ marginBottom: '15px' }}>
                      Clean your diamonds regularly using a soft brush with mild soapy water, then rinse in lukewarm water and gently dry with a lint-free cloth.
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                      Remove your diamond jewellery before sleeping, sports, swimming, or handling harsh chemicals. Exposure to chlorine, bleach, and abrasive products can dull or damage the setting.
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                      Store each piece individually in its original box or pouch to avoid scratches, as diamonds can scratch other jewels. Chains should be closed and laid flat to prevent tangling.
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                      Have your diamonds professionally inspected and cleaned at least once a year at Harene to ensure the settings remain secure and their brilliance is restored.
                    </li>
                    <li>
                      If your piece suffers an impact or shock, avoid wearing it until checked by an expert, as stone settings may loosen.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 mb-40 mb-lg-0">
                <div className="care-img-wrapper" style={{ paddingLeft: '30px' }}>
                  <img src={images[1]} alt="Diamonds" style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gemstone Section */}
        <div className="care-section pt-100 pb-100" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-40 mb-lg-0">
                <div className="care-img-wrapper" style={{ paddingRight: '30px' }}>
                  <img src={images[2]} alt="Gemstone" style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="care-content" style={{ paddingLeft: '30px' }}>
                  <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '25px' }}>Gemstone</h3>
                  <p style={{ fontSize: '15px', color: '#475569', marginBottom: '25px', lineHeight: '1.8' }}>
                    Gemstones are vibrant and unique, each with its own character. Proper care will help preserve their beauty and color over time.
                  </p>
                  <ul className="care-list" style={{ paddingLeft: '20px', color: '#475569', fontSize: '15px', lineHeight: '1.8' }}>
                    <li style={{ marginBottom: '15px' }}>
                      Clean gemstones gently with lukewarm water, mild soap, and a soft brush. Some porous or treated stones may require only a soft cloth – avoid ultrasonic cleaners unless approved for that stone type.
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                      Keep gemstones away from perfume, alcohol, cosmetics, and direct heat, as exposure can alter their color or damage their polish.
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                      Always remove gemstone jewellery before swimming, exercising, or household chores to protect them from accidental knocks and harsh chemicals.
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                      Store them separately in their original box or soft pouch to prevent scratches, as softer stones can be damaged by harder ones.
                    </li>
                    <li>
                      Have your gemstone jewellery checked annually at Harene to ensure secure settings and to maintain their natural brilliance.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <style>{`
          .care-list {
            list-style-type: disc;
            padding-left: 20px;
          }
          .care-list li {
            position: relative;
          }
          .care-img-wrapper {
            transition: transform 0.4s ease;
          }
          .care-img-wrapper:hover {
            transform: scale(1.02);
          }
        `}</style>
      </section>
    </>
  );
};

export default CareInstructionsArea;
