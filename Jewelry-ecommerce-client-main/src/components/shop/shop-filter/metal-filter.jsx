import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import { useGetDynamicFiltersQuery } from "@/redux/features/productApi";

const MetalFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);
  const { data: filtersData, isLoading, isError } = useGetDynamicFiltersQuery();

  const handleFilter = (value) => {
    setCurrPage(1);
    const slug = value.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-");
    const newQuery = { ...router.query, metal: slug };
    router.push({ pathname: `/${shop_right ? "shop-right-sidebar" : "shop"}`, query: newQuery });
    dispatch(handleFilterSidebarClose());
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !filtersData?.data?.metal) return null;

  const ALL_METALS = filtersData.data.metal.filter(m => m && m.trim() !== "");
  const visible = showAll ? ALL_METALS : ALL_METALS.slice(0, 5);

  if (ALL_METALS.length === 0) return null;

  return (
    <div className="tp-shop-widget mb-50">
      <h3 className="tp-shop-widget-title">Metal</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-categories">
          <ul>
            {visible.map((item, i) => {
              const slug = item.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-");
              const isActive = router.query.metal === slug;
              return (
                <li key={i}>
                  <a
                    onClick={() => handleFilter(item)}
                    style={{ cursor: "pointer" }}
                    className={isActive ? "active" : ""}
                  >
                    {item}
                  </a>
                </li>
              );
            })}
          </ul>
          {ALL_METALS.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="tp-shop-widget-show-more"
              style={{
                background: "none",
                border: "none",
                color: "#821f40",
                cursor: "pointer",
                fontSize: "13px",
                padding: "5px 0",
                fontWeight: 500,
              }}
            >
              {showAll ? "− Show Less" : `+ ${ALL_METALS.length - 5} More`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetalFilter;
