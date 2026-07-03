import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const CSR_CARDS = [
  {
    id: 1,
    title: "Responsible Growth, Lasting Impact.",
    number: "01",
    description: "At HARENE, we follow an ethical approach which includes taking all possible measures to ensure that the materials we use in our products are sourced from businesses that follow the law, respect the rights of workers and the communities in which they operate.This policy is intended to affirm our commitment to respect human rights, avoid contributing to finance conflicts and comply with all applicable laws, regulations and national and international conventions, relevant UN sanctions and resolutions.",
    image: "/assets/img/about/about-1.jpg"
  },
  {
    id: 2,
    title: "Responsible Sourcing",
    subtitle: "Kimberley Process requirement",
    number: "02",
    description: "HARENE only buys or sells diamonds that are fully compliant with the Kimberley Process Certification, and we comply with the World Diamond Council (WDC) System of Warranties (SoW). We require our business partners and suppliers involved in the international trade of rough diamonds to comply with the Kimberley Process Certification Scheme (KPCS) requirements and recommendations and to comply with all applicable laws relating to the international trade of diamonds in the countries where they operate. We require our business partners and suppliers in the diamond supply chain, including buying and selling diamonds, (rough, polished, or jewellery), to implement the World Diamond Council (WDC) System of Warranties (SoW) Guidelines from Suppliers.",
    subtitle2: "Coloured Gemstones sourcing",
    description2: "HARENE is committed to implementing the due diligence on the colored gemstones supply chain in accordance with the ICA (International Colored Gemstone Association) of Gems from Conflict-Affected and High-Risk Areas. We require our Suppliers of Gemstone supply chain, including buying and selling Gemstones, (rough, polished, or set in jewellery) to implement the due diligence tools of the Gemstones Working Group or, if members of the ICA Code of Practices where that applies to Gems.",
    image: "/assets/img/about/about-2.jpg"
  },
  {
    id: 3,
    title: "Ethical Business Practices",
    subtitle: "Anti-Money Laundering",
    number: "03",
    description: "HARENE supports and tries to contribute to efforts to eliminate money laundering and financing of terrorism activities where we identify a reasonable risk which may be a result of or connected to, the extraction, trade, handling, transport, or export of Rough be it Diamonds or Gemstone.",
    subtitle2: "Transparent & Responsible Supply Chain",
    description2: "We maintain full transparency throughout our supply chain to ensure every step meets our rigorous ethical standards.",
    image: "/assets/img/slider/4/slider-3.png"
  },
  {
    id: 4,
    title: "Community Empowerment",
    number: "04",
    description: "HARENE believes in creating lasting, positive impact within the communities where we operate and source from. We are committed to supporting initiatives that promote education, skill development, healthcare, and livelihood opportunities. By partnering with local organizations and stakeholders, we aim to strengthen community resilience, foster sustainable growth, and ensure that the benefits of the diamond and gemstone trade extend beyond business into meaningful social progress.",
    image: "/assets/img/slider/4/slider-4.png"
  }
];

const CsrArea = () => {
  const containerRef = useRef(null);
  const [cards, setCards] = useState(CSR_CARDS);

  useEffect(() => {
    fetch('http://192.168.1.211:7000/api/settings/storefront')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.csrImages && data.data.csrImages.length > 0) {
          setCards(prevCards => prevCards.map((c, i) => ({
            ...c,
            image: data.data.csrImages[i] || c.image
          })));
        }
      })
      .catch(e => console.error("Failed to load CSR settings", e));
  }, []);

  useGSAP(() => {
    const cards = gsap.utils.toArray('.anim-card');
    const texts = gsap.utils.toArray('.anim-text');

    // Initial Setup
    // Cards start completely off-screen at the bottom.
    gsap.set(cards, {
      y: (i) => i === 0 ? 0 : "100vh",
      rotation: (i) => [-3, 4, -2, 3][i],
      transformOrigin: "center center",
      zIndex: (i) => i
    });

    // Text starts stacked perfectly using CSS Grid.
    gsap.set(texts, {
      opacity: (i) => i === 0 ? 1 : 0,
      y: (i) => i === 0 ? 0 : 60, // Start 60px down for incoming slide
      pointerEvents: (i) => i === 0 ? 'auto' : 'none'
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%", // Scroll depth controls the speed
        scrub: 1, // Smooth scrubbing
        pin: true,
        anticipatePin: 1
      }
    });

    // Step 1: Pause briefly to read Card 1
    tl.to({}, { duration: 0.5 });

    // Step 2: Slide Card 2 up & crossfade text 1 to 2
    tl.to(texts[0], { opacity: 0, y: -60, duration: 0.5, pointerEvents: 'none' })
      .to(cards[1], { y: 0, duration: 1, ease: "power2.out" }, "<")
      .to(texts[1], { opacity: 1, y: 0, duration: 0.5, pointerEvents: 'auto' }, "-=0.5");

    tl.to({}, { duration: 0.5 }); // Pause

    // Step 3: Slide Card 3 up & crossfade text 2 to 3
    tl.to(texts[1], { opacity: 0, y: -60, duration: 0.5, pointerEvents: 'none' })
      .to(cards[2], { y: 0, duration: 1, ease: "power2.out" }, "<")
      .to(texts[2], { opacity: 1, y: 0, duration: 0.5, pointerEvents: 'auto' }, "-=0.5");

    tl.to({}, { duration: 0.5 }); // Pause

    // Step 4: Slide Card 4 up & crossfade text 3 to 4
    tl.to(texts[2], { opacity: 0, y: -60, duration: 0.5, pointerEvents: 'none' })
      .to(cards[3], { y: 0, duration: 1, ease: "power2.out" }, "<")
      .to(texts[3], { opacity: 1, y: 0, duration: 0.5, pointerEvents: 'auto' }, "-=0.5");

    tl.to({}, { duration: 0.5 }); // Final Pause

  }, { scope: containerRef });

  return (
    <>
      <section className="tp-about-area pt-120 pb-60">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-about-content text-center">
                <div className="tp-about-title-wrapper mb-30">
                  <h3 className="tp-about-title mb-20" style={{ fontSize: '36px' }}>CSR – Corporate Social Responsibility</h3>
                  <p className="mx-auto" style={{ maxWidth: '800px', fontSize: '18px', lineHeight: '1.6' }}>
                    At HARENE, ethical integrity is at the heart of everything we do. We proactively partner with suppliers who uphold the rule of law, champion workers rights, and positively uplift their local communities. This rigorous standard reflects our dedication to safeguarding human rights, preventing conflict financing, and strictly adhering to all international laws, UN sanctions, and global conventions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .gsap-container {
          height: 100vh; width: 100%; background-color: #fafafa; display: flex; overflow: hidden; position: relative;
        }
        /* Bulletproof CSS Grid for perfect stacking & centering without transform conflicts */
        .gsap-left {
          width: 100%; display: grid; align-items: center; position: relative; z-index: 20; height: 100%;
        }
        .gsap-right {
          display: none; width: 50%; position: relative; align-items: center; justify-content: center; height: 100%; z-index: 10; perspective: 1000px;
        }
        .anim-text {
          grid-area: 1 / 1; /* Stacks every text block in the exact same cell */
          padding: 0 2rem;
        }
        @media (min-width: 768px) {
          .gsap-left { width: 50%; }
          .gsap-right { display: flex; }
          .anim-text { padding: 0 5rem; }
        }
        .anim-card {
          position: absolute; width: 450px; height: 450px; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2); background-color: #ffffff; border: 1px solid #e2e8f0;
        }
        .card-overlay {
          position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.4), transparent); z-index: 10;
        }
        .card-img {
          width: 100%; height: 100%; object-fit: cover; position: relative; z-index: 0;
        }
        .gsap-num { font-size: 24px; font-weight: bold; color: #cd9a5b; margin-bottom: 1rem; }
        .gsap-title { font-size: 42px; font-weight: bold; margin-bottom: 1rem; letter-spacing: -0.025em; color: #0f172a; line-height: 1.2; }
        .gsap-subtitle { font-size: 18px; font-weight: bold; color: #475569; margin-bottom: 0.5rem; margin-top: 1.5rem; }
        .gsap-desc { font-size: 16px; font-weight: 500; color: #334155; margin-bottom: 1.5rem; max-width: 48rem; line-height: 1.8; }
      `}</style>

      <div ref={containerRef} className="gsap-container">
        <div className="gsap-left">
          {cards.map((card, i) => (
            <div key={card.id} className="anim-text">
              <h2 className="gsap-num">{card.number}</h2>
              <h1 className="gsap-title">{card.title}</h1>

              {card.subtitle && <h3 className="gsap-subtitle">{card.subtitle}</h3>}
              <p className="gsap-desc">{card.description}</p>

              {card.subtitle2 && <h3 className="gsap-subtitle">{card.subtitle2}</h3>}
              {card.description2 && <p className="gsap-desc">{card.description2}</p>}
            </div>
          ))}
        </div>

        <div className="gsap-right">
          {cards.map((card, i) => (
            <div
              key={card.id}
              className="anim-card"
            >
              <div className="card-overlay"></div>
              <img src={card.image} alt={card.title} className="card-img" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CsrArea;
