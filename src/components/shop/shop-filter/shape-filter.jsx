import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import { useGetDynamicFiltersQuery } from "@/redux/features/productApi";

const ShapeFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: filtersData, isLoading, isError } = useGetDynamicFiltersQuery();

  const handleFilter = (value) => {
    setCurrPage(1);
    const slug = value.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-");
    const newQuery = { ...router.query, shape: slug };
    router.push({ pathname: `/${shop_right ? "shop-right-sidebar" : "shop"}`, query: newQuery });
    dispatch(handleFilterSidebarClose());
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !filtersData?.data?.shape) return null;

  const ALL_SHAPES = filtersData.data.shape.filter(s => s && s.trim() !== "");
  if (ALL_SHAPES.length === 0) return null;

  const shapesWithOthers = [...ALL_SHAPES, "Custom Design"];
  const standardShapes = ["Round", "Oval", "Emerald", "Princess", "Radiant", "Marquise", "Asscher", "Cushion", "Heart"];

  return (
    <div className="tp-shop-widget mb-50">
      <h3 className="tp-shop-widget-title" style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Shape</h3>
      <div className="tp-shop-widget-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {shapesWithOthers.map((item, i) => {
            const slug = item.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-");
            const isActive = router.query.shape === slug;
            const isStandard = standardShapes.includes(item);
            
            return (
              <button
                key={i}
                onClick={() => handleFilter(item)}
                style={{
                  cursor: "pointer",
                  padding: "10px 4px",
                  border: `1px solid ${isActive ? '#1a73e8' : '#e5e7eb'}`,
                  borderRadius: "8px",
                  backgroundColor: isActive ? '#f0f4ff' : '#fff',
                  color: isActive ? '#1a73e8' : '#374151',
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s"
                }}
              >
                {item === "Custom Design" ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                ) : isStandard ? (
                  <img 
                    src={`/assets/img/shapes/${item}.png`} 
                    alt={item} 
                    style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                  />
                ) : (
                  <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <span style={{ fontSize: '18px' }}>💎</span>
                  </div>
                )}
                <span style={{ fontSize: '10px', fontWeight: '500', textAlign: 'center' }}>
                  {item}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShapeFilter;
