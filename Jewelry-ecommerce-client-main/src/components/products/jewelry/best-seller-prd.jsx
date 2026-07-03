import React from 'react';
import { Scrollbar, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// internal
import ProductItem from './product-item';
import ErrorMsg from '@/components/common/error-msg';
import { useGetProductTypeQuery } from '@/redux/features/productApi';
import { HomeTwoBestSellPrdPrdLoader } from '@/components/loader';

// slider setting
const slider_setting = {
  slidesPerView: 4,
  spaceBetween: 24,
  loop: true,
  speed: 4000,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
  },
  scrollbar: {
    el: '.tp-best-swiper-scrollbar',
    draggable: true,
    dragClass: 'tp-swiper-scrollbar-drag',
    snapOnRelease: true,
  },

  breakpoints: {
    '1200': {
      slidesPerView: 4,
    },
    '992': {
      slidesPerView: 4,
    },
    '768': {
      slidesPerView: 2,
    },
    '576': {
      slidesPerView: 2,
    },
    '0': {
      slidesPerView: 1,
    },
  }
}

const BestSellerPrd = () => {
  const { data: products, isError, isLoading } =
    useGetProductTypeQuery({ type: 'jewelry', query: `topSeller=true` });
    
  const swiperRef = React.useRef(null);

  const handleMouseEnter = () => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      if (swiper.resumeTimeout) clearTimeout(swiper.resumeTimeout);
      
      swiper.autoplay.stop();
      const translate = swiper.getTranslate();
      swiper.setTransition(0);
      swiper.setTranslate(translate);
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      if (swiper.resumeTimeout) clearTimeout(swiper.resumeTimeout);
      
      const currentRawTranslate = swiper.getTranslate();
      const sign = currentRawTranslate <= 0 ? -1 : 1;
      const currentTranslate = Math.abs(currentRawTranslate);
      
      const absoluteSnaps = swiper.snapGrid.map(snap => Math.abs(snap)).sort((a, b) => a - b);
      const nextSnap = absoluteSnaps.find(snap => snap > currentTranslate + 1);
      
      if (nextSnap) {
        const remainingDistance = nextSnap - currentTranslate;
        const slideDistance = absoluteSnaps[1] - absoluteSnaps[0] || 1; 
        
        const remainingTime = (remainingDistance / slideDistance) * swiper.params.speed;
        
        swiper.setTransition(remainingTime);
        swiper.setTranslate(sign * nextSnap);
        
        swiper.resumeTimeout = setTimeout(() => {
          if (swiperRef.current) {
             swiperRef.current.setTransition(swiperRef.current.params.speed);
             swiperRef.current.autoplay.start();
          }
        }, remainingTime);
      } else {
        swiper.setTransition(swiper.params.speed);
        swiper.slideNext();
        swiper.autoplay.start();
      }
    }
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <div className='row'>
        <HomeTwoBestSellPrdPrdLoader loading={isLoading} />
      </div>
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    const base_items = products.data.slice(0, 8);
    const product_items = [...base_items, ...base_items, ...base_items];
    content = (
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Swiper 
          onSwiper={(swiper) => swiperRef.current = swiper}
          {...slider_setting} 
          modules={[Scrollbar, Autoplay]} 
          className="tp-best-slider-active swiper-container mb-10 continuous-slider"
        >
          {product_items.map((item, i) => (
            <SwiperSlide key={i} className="tp-best-item-4">
              <ProductItem product={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  }
  return (
    <>
      <section className="tp-best-area pt-115">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-4 mb-50 text-center">
                <span className="tp-section-title-pre-4">Best Seller This Week’s</span>
                <h3 className="tp-section-title-4">Top Sellers In Jewellery & Diamonds for You</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-best-slider">
                {content}
                <div className="tp-best-swiper-scrollbar tp-swiper-scrollbar"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BestSellerPrd;
