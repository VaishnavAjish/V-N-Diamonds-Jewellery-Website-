import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import ParticlesBackground from '@/components/common/ParticlesBackground';
// internal
import slider_img_1 from '@assets/img/slider/4/slider-1.png';
import slider_img_2 from '@assets/img/slider/4/slider-2.png';
import slider_img_3 from '@assets/img/slider/4/slider-3.png';
import slider_img_4 from '@assets/img/slider/4/slider-4.png';
// nav icon
import nav_icon_1 from '@assets/img/slider/4/nav/icon-1.png';
import nav_icon_2 from '@assets/img/slider/4/nav/icon-2.png';
import nav_icon_3 from '@assets/img/slider/4/nav/icon-3.png';
import nav_icon_4 from '@assets/img/slider/4/nav/icon-4.png';
import { ArrowNextTwo, ArrowPrevTwo, Pause, Play } from '@/svg';
import text_shape from '@assets/img/slider/4/shape/rounded-test.png';
import Link from 'next/link';

// slider data 
const fallback_slider_data = [
  { subtitle: 'The original', title: 'Shine bright', img: slider_img_1 },
  { subtitle: 'The original', title: 'Creative Design', img: slider_img_2 },
  { subtitle: 'The original', title: 'Gold Plateted', img: slider_img_3 },
  { subtitle: 'The original', title: 'Unique shapes', img: slider_img_4 },
]

// slider nav data
const slider_nav_data = [
  { icon: nav_icon_1, title: 'Ring <br />& Earring' },
  { icon: nav_icon_2, title: 'Bangles & <br />Bracelets' },
  { icon: nav_icon_3, title: 'Drop <br /> Necklaces' },
  { icon: nav_icon_4, title: 'Diamond <br /> Necklaces' },
]

const JewelryBanner = ({ settings }) => {
  const [slider1, setSlider1] = useState(null);
  const [slider2, setSlider2] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    let lastScrollTime = 0;
    const handleWheel = (e) => {
      e.preventDefault(); // This stops the main page from scrolling

      const now = new Date().getTime();
      // Only allow a slide change every 800ms
      if (now - lastScrollTime < 800) {
        return;
      }

      lastScrollTime = now;
      if (e.deltaY < 0) {
        slider1?.slickPrev();
      } else if (e.deltaY > 0) {
        slider1?.slickNext();
      }
    };

    // Attach non-passive event listener
    navEl.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      navEl.removeEventListener('wheel', handleWheel);
    };
  }, [slider1]);

  const isMinimalDesign = settings?.activeDesignTemplate === 'minimal';

  const dynamic_slider_data = settings?.heroBanners?.length > 0 ? settings.heroBanners : fallback_slider_data;

  //  slider setting 
  const main_slider_setting = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    centerMode: false,
  }
  // nav slider setting 
  const nav_slider_setting = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true,
    dots: false,
    arrows: false,
    centerMode: false,
    focusOnSelect: true,
  }

  // 
  const [play, setPlay] = useState(false);

  const handleToggle = () => {
    if (play === false) {
      setPlay(true);
      const videos = document.querySelectorAll('.tp-slider-video video');
      videos.forEach((video) => video.play());
    } else {
      setPlay(false);
      const videos = document.querySelectorAll('.tp-slider-video video');
      videos.forEach((video) => video.pause());
    }
  };
  return (
    <>
      {/* main slider start */}
      <section className={`tp-slider-area tp-slider-4-transparent ${isMinimalDesign ? 'minimal-design-active' : ''} p-relative z-index-1`} style={{ overflow: 'hidden' }}>

        {/* Background Video with Premium Cinematic Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.15) saturate(1.2)' }}>
            <source src="/assets/video/yet.mp4" type="video/mp4" />
          </video>
          {/* Vignette Gradient Overlay to hide compression artifacts and look premium */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)' }}></div>
        </div>

        <Slider
          {...main_slider_setting}
          asNavFor={slider2}
          ref={(slider) => setSlider1(slider)}
          className="tp-slider-active-4 tp-slider-variation-4"
          style={{ transform: 'translateY(-6vh)' }}
        >
          {dynamic_slider_data.map((item, i) => (
            <div
              key={i}
              className={`tp-slider-item-4 tp-slider-height-4 p-relative d-flex align-items-center`}
            >
              <div className="tp-slider-thumb-4" style={{ mixBlendMode: 'multiply' }}>
                {(item.img && typeof item.img === 'string') ? (
                  <img src={item.img} alt="slider img" className="main-slider-img" style={{ width: '750px', mixBlendMode: 'multiply' }} />
                ) : (
                  <Image src={item.img || fallback_slider_data[i]?.img} alt="slider img" style={{ mixBlendMode: 'multiply', maxWidth: '750px', width: '750px', height: 'auto' }} />
                )}
              </div>

              <div className="tp-slider-video-wrapper">
                {/* <!-- video --> */}
                <div className={`tp-slider-video transition-3 ${play ? 'full-width' : ''}`}>

                  <video loop>
                    <source type="video/mp4" src="http://weblearnbd.net/tphtml/videos/Harene/jewellery-1.mp4#t=3" />
                  </video>
                </div>
                {/* <!-- video button --> */}
                <div className="tp-slider-play">

                  <button onClick={handleToggle} type="button" className={`tp-slider-play-btn tp-slider-video-move-btn tp-video-toggle-btn ${play ? 'hide' : ''}`}>
                    <img className="text-shape" src="/assets/img/slider/4/shape/rounded-test.png" alt="text shape" />
                    <span className="play-icon">
                      <Play />
                    </span>
                    <span className="pause-icon">
                      <Pause />
                    </span>
                  </button>
                </div>
              </div>

              <div className="container">
                <div className="row align-items-center">
                  <div className="col-xl-6 col-lg-6 col-md-8">
                    <div className="tp-slider-content-4 p-relative z-index-1">
                      <span>{item.subtitle}</span>
                      <h3 className="tp-slider-title-4">{item.title}</h3>
                      <div className="tp-slider-btn-4">
                        <Link href="/shop" className="tp-btn tp-btn-border tp-btn-border-white">Discover Now</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>


        <div className="container p-relative" style={{ height: '100%' }}>
          <div
            ref={navRef}
            className="tp-slider-nav"
            style={{ position: 'absolute', bottom: '160px', left: '60px', zIndex: 9, width: '250px' }}
          >


            <Slider {...nav_slider_setting} asNavFor={slider1} ref={(slider) => setSlider2(slider)} className="tp-slider-nav-active">
              {dynamic_slider_data.map((item, i) => (
                <div key={i} className="tp-slider-nav-item d-flex align-items-center" style={{ padding: '8px 0' }}>
                  <div className="tp-slider-nav-icon" style={{ width: '40px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                    <span>
                      <Image src={slider_nav_data[i]?.icon} alt="icon" style={{ maxWidth: '40px', filter: 'brightness(0) invert(1)' }} />
                    </span>
                  </div>
                  <div className="tp-slider-nav-content" style={{ marginLeft: '15px' }}>
                    <h3 className="tp-slider-nav-title" dangerouslySetInnerHTML={{ __html: item.navTitle || slider_nav_data[i]?.title }} style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: 0, lineHeight: '1.2' }}></h3>
                  </div>
                </div>
              ))}
            </Slider>


          </div>
        </div>
      </section>
    </>
  );
};

export default JewelryBanner;
