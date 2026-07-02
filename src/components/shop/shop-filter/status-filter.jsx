import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import { useGetDynamicFiltersQuery } from "@/redux/features/productApi";

const StatusFilter = ({setCurrPage,shop_right=false}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: filtersData, isLoading, isError } = useGetDynamicFiltersQuery();

  // handle status route 
  const handleStatusRoute = (status) => {
    setCurrPage(1)
    const slug = status.toLowerCase().replace("&", "").split(" ").join("-");
    const newQuery = { ...router.query, status: slug };
    router.push({ pathname: `/${shop_right ? 'shop-right-sidebar' : 'shop'}`, query: newQuery });
    dispatch(handleFilterSidebarClose())
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError || !filtersData?.data?.status) return null;

  const statusList = filtersData.data.status.filter(s => s && s.trim() !== "");
  if (statusList.length === 0) return null;

  return (
    <div className="tp-shop-widget mb-50">
      <h3 className="tp-shop-widget-title">Product Status</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-checkbox">
          <ul className="filter-items filter-checkbox">
            {statusList.map((s, i) => (
              <li key={i} className="filter-item checkbox">
                <input
                  id={s}
                  type="checkbox"
                  checked={
                    router.query.status ===
                    s.toLowerCase().replace("&", "").split(" ").join("-")
                      ? "checked"
                      : false
                  }
                  readOnly
                />
                <label
                  onClick={() => handleStatusRoute(s)}
                  htmlFor={s}
                >
                  {s}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatusFilter;
