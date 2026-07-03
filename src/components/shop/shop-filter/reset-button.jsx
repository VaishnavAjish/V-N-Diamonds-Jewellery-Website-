import { useRouter } from "next/router";
import React from "react";

const ResetButton = ({ shop_right = false }) => {
  const router = useRouter();
  
  if (Object.keys(router.query).length === 0) {
    return null;
  }

  return (
    <div className="tp-shop-widget mb-50">
      <h3 className="tp-shop-widget-title">Reset Filter</h3>
      <button
        onClick={() =>
          router.push(`/${shop_right ? "shop-right-sidebar" : "shop"}`)
        }
        className="tp-btn"
      >
        Reset Filter
      </button>
    </div>
  );
};

export default ResetButton;
