import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
// internal
import { handleProductModal } from "@/redux/features/productModalSlice";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import { add_to_compare } from "@/redux/features/compareSlice";

const ProductItem = ({ product, style_2 = false }) => {
  const { img, category, title, reviews, price, discount, tags, status, description, parent, children, videoId, quantity } = product || {};
  const _id = product?.id || product?._id;
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  // Get the clean product name — just the title as-is (poetic name)
  const productName = title || 'Untitled';

  const caratWgtMatch = description?.match(/Total Diamond Weight:\s*([\d.]+)/);
  const caratWgt = caratWgtMatch ? caratWgtMatch[1] : null;

  // Balance = quantity in stock
  const balance = quantity !== undefined && quantity !== null ? quantity : null;

  return (
    <div className={`skylab-product-card mb-40`} style={{
      background: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Image Area */}
      <div 
        className="skylab-product-img-wrapper" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '250px'
        }}>
        
        {/* Product Image / Hover Video */}
        <Link href={`/product-details/${_id}`} style={{ width: '100%', height: '100%', position: 'relative' }}>
          {isHovered && videoId ? (
            (videoId.startsWith('http') || videoId.startsWith('/')) ? (
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
              >
                <source src={videoId} type="video/mp4" />
              </video>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1, border: 'none', pointerEvents: 'none' }}
                allow="autoplay; encrypted-media"
                title="Product Video"
              />
            )
          ) : (
            <Image
              src={(img && (img.startsWith('http') || img.startsWith('/'))) ? img : 'https://images.unsplash.com/photo-1605100804763-247f67982213?auto=format&fit=crop&q=80&w=800'}
              alt="product img"
              fill
              style={{ objectFit: 'contain' }}
              unoptimized={true}
            />
          )}
        </Link>
      </div>

      {/* Details Area — center aligned */}
      <div className="skylab-product-details" style={{ padding: '15px', textAlign: 'center' }}>
        {/* Product Name */}
        <Link href={`/product-details/${_id}`}>
          <h3 style={{ 
            fontSize: '13px', 
            margin: '0 0 8px 0', 
            color: '#333', 
            fontWeight: '600',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {productName}
          </h3>
        </Link>

        {/* Carat Weight */}
        {caratWgt && (
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
            {caratWgt} ct
          </div>
        )}

        {/* Balance (Quantity in Stock) */}
        {balance !== null && (
          <div style={{ fontSize: '12px', color: '#888' }}>
            Balance: {balance}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;


