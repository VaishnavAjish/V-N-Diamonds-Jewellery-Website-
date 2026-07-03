import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const CARDS = [
  {
    id: 1,
    title: "Asset Management",
    number: "01",
    description: "We provide comprehensive asset management services tailored to your financial goals.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Brokerage",
    number: "02",
    description: "Execute trades with precision and speed using our advanced brokerage platform.",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Advisory",
    number: "03",
    description: "Expert financial advisory to help you navigate complex markets with confidence.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=800&auto=format&fit=crop"
  }
];

const ScrollCardSection = () => {
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useGSAP(() => {
    const cards = gsap.utils.toArray('.anim-card');
    
    // Initial setup: Push cards down and give them distinct rotations
    gsap.set(cards, {
      yPercent: 50,
      rotation: (i) => [90, -90, -40][i],
      transformOrigin: "bottom center",
      opacity: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%", // 3 screens of scrolling
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          // Adjust active text based on scroll progress
          const progress = self.progress;
          let newIndex = 0;
          if (progress > 0.3 && progress <= 0.6) newIndex = 1;
          else if (progress > 0.6) newIndex = 2;
          
          if (newIndex !== activeIndexRef.current) {
            activeIndexRef.current = newIndex;
            
            // Fade out text, swap, fade back in for smooth transition
            gsap.to(textContainerRef.current, {
              opacity: 0,
              y: -10,
              duration: 0.2,
              onComplete: () => {
                setActiveIndex(newIndex);
                gsap.to(textContainerRef.current, {
                  opacity: 1,
                  y: 0,
                  duration: 0.2
                });
              }
            });
          }
        }
      }
    });

    // Animate cards into fanned position
    tl.to(cards, {
      yPercent: 0,
      opacity: 1,
      rotation: (i) => [-15, 0, 15][i], // Fanned final resting rotations
      ease: "sine.out",
      stagger: 0.05, // Slight stagger so they don't move perfectly identically
      duration: 1
    }, 0);

    // Fade out entire section at the end of the scroll trigger
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut"
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="h-screen w-full bg-slate-900 flex overflow-hidden text-white relative">
      {/* Left Column (Sticky content mapped to state) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-20 z-20">
        <div ref={textContainerRef}>
          <h2 className="text-xl md:text-2xl font-bold text-slate-400 mb-4">{CARDS[activeIndex].number}</h2>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">{CARDS[activeIndex].title}</h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-lg leading-relaxed">
            {CARDS[activeIndex].description}
          </p>
          <button className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-full w-max hover:bg-slate-200 transition-colors shadow-xl">
            More Details
          </button>
        </div>
      </div>

      {/* Right Column (Scrollable fanning cards) */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center h-full z-10 perspective-1000">
        {CARDS.map((card, i) => (
          <div 
            key={card.id} 
            className="anim-card absolute w-[350px] h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-slate-800"
            style={{ 
              zIndex: i,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            <img 
              src={card.image} 
              alt={card.title} 
              className="w-full h-full object-cover relative z-0" 
            />
            {/* Optional overlay text on the card itself */}
            <h3 className="absolute bottom-6 left-6 text-2xl font-bold z-20">{card.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollCardSection;
