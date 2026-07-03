import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import { useGetDynamicFiltersQuery } from "@/redux/features/productApi";

const SubCategoryFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);
  const { data: filtersData, isLoading, isError } = useGetDynamicFiltersQuery();

  const handleFilter = (value) => {
    setCurrPage(1);
    const slug = value.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-");
    const newQuery = { ...router.query, subCategory: slug };
    router.push({ pathname: `/${shop_right ? "shop-right-sidebar" : "shop"}`, query: newQuery });
    dispatch(handleFilterSidebarClose());
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !filtersData?.data?.subCategory) return null;

  const ALL_SUBCATEGORIES = filtersData.data.subCategory.filter(c => c && c.trim() !== "");

  const visible = showAll ? ALL_SUBCATEGORIES : ALL_SUBCATEGORIES.slice(0, 5);

  if (ALL_SUBCATEGORIES.length === 0) return null;

  return (
    <div className="tp-shop-widget mb-50">
      <h3 className="tp-shop-widget-title">Sub Category</h3>
      <div className="tp-shop-widget-content">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {visible.map((item, i) => {
              const slug = item.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-");
              const isActive = router.query.subCategory === slug;
              return (
                <button
                  key={i}
                  onClick={() => handleFilter(item)}
                  style={{
                    cursor: "pointer",
                    padding: "4px 12px",
                    border: `1px solid ${isActive ? '#1a73e8' : '#e5e7eb'}`,
                    borderRadius: "20px",
                    backgroundColor: isActive ? '#f0f4ff' : '#fff',
                    color: isActive ? '#1a73e8' : '#374151',
                    fontSize: "12px",
                    fontWeight: "500",
                    transition: "all 0.2s"
                  }}
                >
                  {item}
                </button>
              );
            })}
          {ALL_SUBCATEGORIES.length > 5 && (
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
              }}
            >
              {showAll ? "− Show Less" : `+ ${ALL_SUBCATEGORIES.length - 5} More`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryFilter;
