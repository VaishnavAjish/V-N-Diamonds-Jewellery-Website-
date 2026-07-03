import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
// internal
import ErrorMsg from "@/components/common/error-msg";
import { useGetDynamicFiltersQuery } from "@/redux/features/productApi";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import ShopCategoryLoader from "@/components/loader/shop/shop-category-loader";

const CategoryFilter = ({setCurrPage,shop_right=false}) => {
  const { data: filtersData, isLoading, isError } = useGetDynamicFiltersQuery();
  const router = useRouter();
  const dispatch = useDispatch();

  // handle category route
  const handleCategoryRoute = (title) => {
    setCurrPage(1);
    const slug = title.toLowerCase().replace("&", "").split(" ").join("-");
    const newQuery = { ...router.query, category: slug };
    delete newQuery.subCategory; // Clear subcategory when a new main category is clicked
    router.push({ pathname: `/${shop_right ? 'shop-right-sidebar' : 'shop'}`, query: newQuery });
    dispatch(handleFilterSidebarClose());
  }
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopCategoryLoader loading={isLoading}/>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && filtersData?.data?.category?.length === 0) {
    content = <ErrorMsg msg="No Category found!" />;
  }
  if (!isLoading && !isError && filtersData?.data?.category?.length > 0) {
    const category_items = filtersData.data.category.filter(c => c && c.trim() !== "");
    content = category_items.map((item, i) => {
      const isActive = router.query.category === item.toLowerCase().replace("&", "").split(" ").join("-");
      return (
        <button
          key={i}
          onClick={() => handleCategoryRoute(item)}
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
    });
  }
  return (
    <>
      <div className="tp-shop-widget mb-50">
        <h3 className="tp-shop-widget-title" style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Category</h3>
        <div className="tp-shop-widget-content">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {content}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryFilter;
