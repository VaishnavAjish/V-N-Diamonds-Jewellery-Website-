import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
// internal
import { AddCart, Cart, QuickView, Wishlist } from "@/svg";
import { handleProductModal } from "@/redux/features/productModalSlice";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import { notifyError } from "@/utils/toast";

const ProductSliderItem = ({ product }) => {
  const { title, price, img, status, videoId } = product || {};
  const [hovered, setHovered] = useState(false);
  const _id = product?.id || product?._id;
  const { cart_products } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const isAddedToCart = cart_products.some((prd) => prd._id === _id);
  const isAddedToWishlist = wishlist.some((prd) => prd._id === _id);
  const dispatch = useDispatch();

  // handle add product
  const handleAddProduct = (prd) => {
    if (prd.status === 'out-of-stock') {
      notifyError(`This product out-of-stock`)
    }
    else {
      dispatch(add_cart_product(prd));
    }
  };
  // handle wishlist product
  const handleWishlistProduct = (prd) => {
    dispatch(add_to_wishlist(prd));
  };
  const cleanTitle = (t) => {
    if (!t) return '';
    return t.replace(/\s*\(.*?\)\s*/g, ' ').trim();
  };

  return (
    <div
      className="tp-category-item-4 p-relative z-index-1 fix text-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ height: '360px', overflow: 'hidden', borderRadius: '8px' }}
    >
      <div
        className="tp-category-thumb-4 include-bg"
        style={{
          backgroundImage: `url('${encodeURI(img || '')}')`,
          backgroundColor: "#FFFFFF",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%",
        }}
      ></div>

      {videoId && (videoId.startsWith('http://') || videoId.startsWith('https://')) ? (
        <video
          src={videoId}
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
          ref={(el) => {
            if (el) {
              if (hovered) {
                el.play().catch(err => console.log("Video play failed:", err));
              } else {
                el.pause();
                el.currentTime = 0;
              }
            }
          }}
        />
      ) : null}
      <div className="tp-product-action-3 tp-product-action-4 tp-product-action-blackStyle tp-product-action-brownStyle">
        <div className="tp-product-action-item-3 d-flex flex-column">
          {isAddedToCart ? (
            <Link
              href="/cart"
              className={`tp-product-action-btn-3 ${isAddedToCart ? 'active' : ''} tp-product-add-cart-btn`}
            >
              <Cart />
              <span className="tp-product-tooltip">View Cart</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => handleAddProduct(product)}
              className={`tp-product-action-btn-3 ${isAddedToCart ? 'active' : ''} tp-product-add-cart-btn`}
            >
              <Cart />
              <span className="tp-product-tooltip">Add to Cart</span>
            </button>
          )}
          <button
            type="button"
            className="tp-product-action-btn-3 tp-product-quick-view-btn"
            onClick={() => dispatch(handleProductModal(product))}
          >
            <QuickView />
            <span className="tp-product-tooltip">Quick View</span>
          </button>
          <button
            type="button"
            onClick={() => handleWishlistProduct(product)}
            className={`tp-product-action-btn-3 ${isAddedToWishlist ? 'active' : ''} tp-product-add-to-wishlist-btn`}
          >
            <Wishlist />
            <span className="tp-product-tooltip">Add To Wishlist</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSliderItem;
