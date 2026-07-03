import { useState } from "react";
import InputRange from "@/ui/input-range";

const PriceFilter = ({ priceFilterValues, maxPrice }) => {
  const { priceValue, handleChanges } = priceFilterValues;

  const inputStyle = {
    width: "40px",
    height: "24px",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    textAlign: "center",
    fontSize: "11px",
    padding: "0 4px",
    color: "#333",
  };

  return (
    <>
      <div className="tp-shop-widget mb-35">
        <h3 className="tp-shop-widget-title no-border" style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>
          PRICE
        </h3>

        <div className="tp-shop-widget-content">


          {/* Price Filter (Functional) */}
          <div className="tp-shop-widget-filter">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#555' }}>Price <br/><span style={{fontSize: '9px'}}>(USD)</span></span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '10px', color: '#888' }}>MIN</span>
                <input type="text" value={`$${priceValue[0]}`} readOnly style={inputStyle} />
                <span style={{ fontSize: '10px', color: '#888' }}>- MAX</span>
                <input type="text" value={`$${priceValue[1]}`} readOnly style={inputStyle} />
              </div>
            </div>
            <div id="slider-range" className="mb-10">
                <InputRange
                  STEP={1}
                  MIN={0}
                  MAX={maxPrice}
                  values={priceValue}
                  handleChanges={handleChanges}
                />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceFilter;
