import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import { useGetDynamicFiltersQuery } from "@/redux/features/productApi";

const CertificateFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: filtersData, isLoading, isError } = useGetDynamicFiltersQuery();

  const handleFilter = (value) => {
    setCurrPage(1);
    const slug = value.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-");
    const newQuery = { ...router.query, certificate: slug };
    router.push({ pathname: `/${shop_right ? "shop-right-sidebar" : "shop"}`, query: newQuery });
    dispatch(handleFilterSidebarClose());
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !filtersData?.data?.certificate) return null;

  const ALL_CERTS = filtersData.data.certificate.filter(c => c && c.trim() !== "");
  if (ALL_CERTS.length === 0) return null;

  return (
    <div className="tp-shop-widget mb-50">
      <h3 className="tp-shop-widget-title">Certificate</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-categories">
          <ul>
            {ALL_CERTS.map((item, i) => {
              const slug = item.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-");
              const isActive = router.query.certificate === slug;
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
        </div>
      </div>
    </div>
  );
};

export default CertificateFilter;
