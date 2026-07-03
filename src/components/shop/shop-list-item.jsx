import React from "react";
import Image from "next/image";
import Link from "next/link";
import { QuickView } from "@/svg"; // Reusing an icon for the action column

const ShopListItem = ({ product }) => {
  const { img, title, price, tags, sku, parent, children, imageURLs, quantity } = product || {};
  const _id = product?.id || product?._id;

  // Extract color
  const color = imageURLs && imageURLs[0] && imageURLs[0].color ? imageURLs[0].color.name : "-";

  // Extract shape (assume tags have shapes, or it's a property)
  const shape = product.shape || (tags && tags.find(t => ['Round', 'Emerald', 'Radiant', 'Oval', 'Heart', 'Princess', 'Cushion', 'Marquise', 'Asscher'].includes(t))) || "-";

  // Setting Type
  const setting = product.setting || (tags && tags.find(t => ['Prong', 'Bezel', 'Half Bezel', 'Channel', 'Flush', 'PaveMicro', 'Burnish'].includes(t))) || "-";

  // Metal
  const metal = product.metal || (tags && tags.find(t => typeof t === 'string' && (t.includes('GOLD') || t.includes('PLATINUM') || t.includes('SILVER')))) || "-";

  const catSubcat = `${parent || ''} / ${children || ''}`;
  const lotNameSku = sku || _id?.substring(0, 8) || "N/A";
  const lotNameTitle = title || "";

  return (
    <tr className="align-middle" style={{ backgroundColor: '#fff', borderBottom: '1px solid #f3f3f3', transition: 'all 0.2s', fontSize: '14px' }}>
      <td style={{ padding: '12px' }}>
        <Link href={`/product-details/${_id}`}>
          <div style={{ width: '115px', height: '115px', position: 'relative', overflow: 'hidden', borderRadius: '4px', backgroundColor: '#000' }}>
            <Image src={(img && (img.startsWith('http') || img.startsWith('/'))) ? img : 'https://images.unsplash.com/photo-1605100804763-247f67982213?auto=format&fit=crop&q=80&w=800'} alt="product img" layout="fill" objectFit="contain" unoptimized={true} />
          </div>
        </Link>
      </td>
      <td style={{ padding: '12px', minWidth: '150px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong style={{ fontSize: '13px', color: '#111' }}>{lotNameSku} | {lotNameTitle.substring(0, 25)}</strong>
        </div>
      </td>
      <td style={{ padding: '12px', color: '#555' }}>{shape}</td>
      <td style={{ padding: '12px', color: '#555' }}>{color}</td>
      <td style={{ padding: '12px', color: '#555' }}>{catSubcat}</td>
      <td style={{ padding: '12px', color: '#555' }}>{setting}</td>
      <td style={{ padding: '12px', color: '#555' }}>{metal}</td>
      <td style={{ padding: '12px', color: '#555' }}>{quantity || 0}</td>
      <td style={{ padding: '12px', fontWeight: '600' }}>${price}</td>
      <td style={{ padding: '12px', textAlign: 'right' }}>
        <Link href={`/product-details/${_id}`} style={{ display: 'inline-flex', padding: '6px', borderRadius: '4px', backgroundColor: '#f0f4ff', color: '#1a73e8' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </Link>
      </td>
    </tr>
  );
};

export default ShopListItem;
