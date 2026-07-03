import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
// internal
import ErrorMsg from "@/components/common/error-msg";
import { useGetDynamicFiltersQuery } from "@/redux/features/productApi";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import ShopColorLoader from "@/components/loader/shop/color-filter-loader";

const ColorFilter = ({setCurrPage,shop_right=false}) => {
  const { data: filtersData, isError, isLoading } = useGetDynamicFiltersQuery();
  const router = useRouter();
  const dispatch = useDispatch()
  const [showAll, setShowAll] = useState(false);

  // handle metal 
  const handleMetal = (metalVal) => {
    setCurrPage(1)
    const slug = metalVal.toLowerCase().replace("&", "").split(" ").join("-");
    const newQuery = { ...router.query, metal: slug };
    router.push({ pathname: `/${shop_right ? 'shop-right-sidebar' : 'shop'}`, query: newQuery });
    dispatch(handleFilterSidebarClose())
  }
  // decide what to render
  let content = null;
  let uniqueMetals = [];

  if (isLoading) {
    content = <ShopColorLoader loading={isLoading}/>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && filtersData?.data?.metal?.length === 0) {
    content = <ErrorMsg msg="No Metals found!" />;
  }
  if (!isLoading && !isError && filtersData?.data?.metal?.length > 0) {
    uniqueMetals = filtersData.data.metal.filter(c => c && c.trim() !== "");
    
    const visibleMetals = showAll ? uniqueMetals : uniqueMetals.slice(0, 5);
    
    content = visibleMetals.map((item, i) => {
      if (item) {
        const isActive = router.query.metal === item.toLowerCase().replace("&", "").split(" ").join("-");
        return (
          <button
            key={i}
            onClick={() => handleMetal(item)}
            style={{
              cursor: "pointer",
              padding: "4px 12px",
              border: `1px solid ${isActive ? '#1a73e8' : '#e5e7eb'}`,
              borderRadius: "20px",
              backgroundColor: isActive ? '#f0f4ff' : '#fff',
              color: isActive ? '#1a73e8' : '#374151',
              fontSize: "12px",
              fontWeight: "500",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            {item}
          </button>
        );
      }
    });
  }

  return (
    <>
      <div className="tp-shop-widget mb-50">
        <h3 className="tp-shop-widget-title" style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Metal</h3>
        <div className="tp-shop-widget-content">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {content}
            {uniqueMetals.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="tp-shop-widget-show-more"
                style={{
                  background: "none",
                  border: "none",
                  color: "#1a73e8",
                  cursor: "pointer",
                  fontSize: "12px",
                  padding: "4px 12px",
                  fontWeight: 600,
                  marginTop: "0"
                }}
              >
                {showAll ? "− Show Less" : `+ ${uniqueMetals.length - 5} More`}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ColorFilter;
