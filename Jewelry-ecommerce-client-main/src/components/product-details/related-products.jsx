import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
// internal
import { useGetRelatedProductsQuery } from "@/redux/features/productApi";
import ProductItem from "../products/fashion/product-item";
import ErrorMsg from "../common/error-msg";
import { HomeNewArrivalPrdLoader } from "../loader";

// slider setting
const slider_setting = {
  slidesPerView: 4,
  spaceBetween: 24,
  navigation: {
    nextEl: ".tp-related-slider-button-next",
    prevEl: ".tp-related-slider-button-prev",
  },
  autoplay: {
    delay: 5000,
  },
  breakpoints: {
    1200: { slidesPerView: 4 },
    992: { slidesPerView: 3 },
    768: { slidesPerView: 2 },
    576: { slidesPerView: 2 },
    0: { slidesPerView: 2, spaceBetween: 10 },
  },
};

const RelatedProducts = ({ id, category }) => {
  // Use the dedicated related products API — it fetches same-category products by product ID
  const { data: products, isError, isLoading } = useGetRelatedProductsQuery(id, { skip: !id });

  let content = null;

  if (isLoading) {
    content = <HomeNewArrivalPrdLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError) {
    // Support both { data: [...] } and direct array responses
    const rawList = Array.isArray(products?.data)
      ? products.data
      : Array.isArray(products)
      ? products
      : [];

    // Exclude the current product just in case backend returns it
    const product_items = rawList.filter(
      (p) => (p._id || p.id) !== id
    ).slice(0, 8);

    if (product_items.length === 0) {
      content = null;
    } else {
      content = (
        <Swiper
          {...slider_setting}
          modules={[Autoplay, Navigation]}
          className="tp-product-related-slider-active swiper-container mb-10"
        >
          {product_items.map((item, i) => (
            <SwiperSlide key={item._id || item.id || i}>
              <ProductItem product={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }
  }

  return (
    <div className="tp-product-related-slider">
      {content}
    </div>
  );
};

export default RelatedProducts;

