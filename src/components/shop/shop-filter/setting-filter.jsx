import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";

const ALL_SETTINGS = [
  "Prong", "Bezel", "Half Bezel", "Channel", "Flush", "Bezel - Prong",
  "U Prong", "Prong - Bezel Black Rhodi.", "Bezel - Light Green Enamal",
  "Half Bezel - Prong", "PaveMicro", "Bezel - Black Rhodium",
  "Bezel - Prong Light Green Enamal", "Bezel - Black Enamal",
  "Bezel - Dark Green Enamal", "Bezel - Blue Enamal", "Bezel - Yellow Enamal",
  "Bezel - Black Rhodi.", "Burnish",
];

const SettingFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);

  const handleFilter = (value) => {
    setCurrPage(1);
    const slug = value.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-");
    const newQuery = { ...router.query, setting: slug };
    router.push({ pathname: `/${shop_right ? "shop-right-sidebar" : "shop"}`, query: newQuery });
    dispatch(handleFilterSidebarClose());
  };

  const visible = showAll ? ALL_SETTINGS : ALL_SETTINGS.slice(0, 5);

  return (
    <div className="tp-shop-widget mb-50">
      <h3 className="tp-shop-widget-title">Setting Type</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-categories">
          <ul>
            {visible.map((item, i) => {
              const slug = item.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-");
              const isActive = router.query.setting === slug;
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
          {ALL_SETTINGS.length > 5 && (
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
              {showAll ? "− Show Less" : `+ ${ALL_SETTINGS.length - 5} More`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingFilter;
