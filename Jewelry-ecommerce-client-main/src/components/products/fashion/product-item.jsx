import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
// internal
import { handleProductModal } from "@/redux/features/productModalSlice";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import { add_to_compare } from "@/redux/features/compareSlice";

const SHAPES = ['ROUND', 'OVAL', 'EMERALD', 'PRINCESS', 'RADIANT', 'MARQUISE', 'ASSCHER', 'CUSHION', 'HEART', 'MIX'];
const SETTINGS = ["Prong", "Bezel", "Half Bezel", "Channel", "Flush", "Bezel - Prong", "U Prong", "Prong - Bezel Black Rhodi.", "Bezel - Light Green Enamal", "Half Bezel - Prong", "PaveMicro", "Bezel - Black Rhodium", "Bezel - Prong Light Green Enamal", "Bezel - Black Enamal", "Bezel - Dark Green Enamal", "Bezel - Blue Enamal", "Bezel - Yellow Enamal", "Bezel - Black Rhodi.", "Burnish"];
const METALS = ["18K WHITE GOLD", "14K TWO TONE", "14K WHITE GOLD", "14K YELLOW GOLD", "18K YELLOW GOLD", "PLATINUM", "18K ROSE GOLD", "SILVER", "18K YELLOW GOLD - PLATINUM", "18K TWO TONE", "9K WHITE GOLD - 14K WHITE GOLD", "14K ROSE GOLD", "10K WHITE GOLD", "9K YELLOW GOLD", "10K YELLOW GOLD"];

const ProductItem = ({ product, style_2 = false }) => {
  const { img, category, title, reviews, price, discount, tags, status, description, parent, children, videoId } = product || {};
  const _id = product?.id || product?._id;
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  // Parse Data
  const shape = (tags || []).map(t => t.toUpperCase()).find(t => SHAPES.includes(t)) || 'N/A';
  const color = product?.imageURLs?.[0]?.color?.name || 'N/A';
  const setting = SETTINGS.find(s => title?.includes(s) || (tags || []).includes(s)) || 'N/A';
  const metalId = (tags || []).find(t => METALS.includes(t.toUpperCase())) || 'N/A';
  
  const metalWgtMatch = description?.match(/Metal Weight:\s*([\d.]+)/);
  const metalWgt = metalWgtMatch ? metalWgtMatch[1] : 'N/A';

  const caratWgtMatch = description?.match(/Total Diamond Weight:\s*([\d.]+)/);
  const caratWgt = caratWgtMatch ? caratWgtMatch[1] : 'N/A';

  // Determine shape badge color class
  const getShapeColor = (s) => {
    switch (s) {
      case 'ROUND': return '#1a73e8';
      case 'EMERALD': return '#0f9d58';
      case 'RADIANT': return '#f29900';
      case 'OVAL': return '#673ab7';
      default: return '#5f6368';
    }
  };

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

      {/* Details Area */}
      <div className="skylab-product-details" style={{ padding: '15px' }}>
        {/* SKU Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <Link href={`/product-details/${_id}`}>
            <h3 style={{ 
              fontSize: '12px', 
              margin: 0, 
              color: '#333', 
              fontWeight: '600',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '180px'
            }}>
              {title.split(' | ')[0] || title.substring(0, 20)}
            </h3>
          </Link>
          <span style={{ fontSize: '10px', fontWeight: 'bold', color: getShapeColor(shape) }}>
            {shape}
          </span>
        </div>



        {/* Footer (Price & Carat) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: '#0f9d58' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#111' }}>
              ${price}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {caratWgt !== 'N/A' ? `${caratWgt} ct` : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
