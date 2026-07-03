import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Scrollbar, Autoplay } from 'swiper';
// internal
import { useGetProductTypeQuery } from '@/redux/features/productApi';
import ProductSliderItem from './product-slider-item';
import ErrorMsg from '@/components/common/error-msg';
import { HomeTwoPopularPrdLoader } from '@/components/loader';


// slider setting 
const slider_setting = {
  slidesPerView: 5,
  spaceBetween: 25,
  loop: true,
  speed: 4000,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".tp-category-slider-dot-4",
    clickable: true,
  },
  scrollbar: {
    el: '.tp-category-swiper-scrollbar',
    draggable: true,
    dragClass: 'tp-swiper-scrollbar-drag',
    snapOnRelease: true,
  },
  breakpoints: {
    '1400': {
      slidesPerView: 5,
    },
    '1200': {
      slidesPerView: 4,
    },
    '992': {
      slidesPerView: 3,
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

const PopularProducts = () => {
  const { data: products, isError, isLoading } =
    useGetProductTypeQuery({ type: 'jewelry', query: `new=true` });

  const swiperRef = React.useRef(null);

  const handleMouseEnter = () => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      // Clear any pending timeout from mouseleave
      if (swiper.resumeTimeout) clearTimeout(swiper.resumeTimeout);

      swiper.autoplay.stop();
      // Instantly freeze the CSS transition by setting translate to its current computed value
      const translate = swiper.getTranslate();
      swiper.setTransition(0);
      swiper.setTranslate(translate);
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      if (swiper.resumeTimeout) clearTimeout(swiper.resumeTimeout);

      // Calculate exact remaining time to maintain constant linear speed
      const currentRawTranslate = swiper.getTranslate();
      const sign = currentRawTranslate <= 0 ? -1 : 1;
      const currentTranslate = Math.abs(currentRawTranslate);

      // Map snapGrid to absolute values and sort to find the next snap point
      const absoluteSnaps = swiper.snapGrid.map(snap => Math.abs(snap)).sort((a, b) => a - b);
      // Find the next snap point that is strictly greater than current position (with a 1px buffer)
      const nextSnap = absoluteSnaps.find(snap => snap > currentTranslate + 1);

      if (nextSnap) {
        const remainingDistance = nextSnap - currentTranslate;
        const slideDistance = absoluteSnaps[1] - absoluteSnaps[0] || 1;

        // Time = (Remaining Distance / Total Distance) * Total Time
        const remainingTime = (remainingDistance / slideDistance) * swiper.params.speed;

        // Resume sliding to the next snap point at the EXACT same linear speed
        swiper.setTransition(remainingTime);
        swiper.setTranslate(sign * nextSnap);

        // Once it reaches the next snap, restore normal autoplay
        swiper.resumeTimeout = setTimeout(() => {
          if (swiperRef.current) {
            swiperRef.current.setTransition(swiperRef.current.params.speed);
            swiperRef.current.autoplay.start();
          }
        }, remainingTime);
      } else {
        // Fallback if snap point isn't found
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
      <HomeTwoPopularPrdLoader loading={isLoading} />
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    const filtered_products = products.data.filter(p => {
      const cat = (p.parent || '').toLowerCase();
      const subCat = (p.children || '').toLowerCase();
      return !cat.includes('watch') && !subCat.includes('watch') && !cat.includes('lgd') && !subCat.includes('lgd');
    });

    const base_items = filtered_products.slice(0, 8);
    // Duplicate items so Swiper has plenty of elements to create a seamless infinite loop without jumping
    const product_items = [...base_items, ...base_items, ...base_items];
    content = (
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Swiper
          onSwiper={(swiper) => swiperRef.current = swiper}
          {...slider_setting}
          modules={[Scrollbar, Pagination, Autoplay]}
          className="tp-category-slider-active-4 swiper-container mb-70 continuous-slider"
        >
          {product_items.map((item, i) => (
            <SwiperSlide key={i}>
              <ProductSliderItem product={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  }
  return (
    <>
      <section className="tp-category-area pt-115 pb-105 tp-category-plr-85" style={{ backgroundColor: `#EFF1F5` }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-4 mb-60 text-center">
                <span className="tp-section-title-pre-4">Shop by Category</span>
                <h3 className="tp-section-title-4">Popular on the Harene.</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-category-slider-4">
                {content}
                <div className="tp-category-swiper-scrollbar tp-swiper-scrollbar"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PopularProducts;
