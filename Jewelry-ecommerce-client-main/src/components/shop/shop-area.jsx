import React, { useState } from "react";
import Pagination from "@/ui/Pagination";
import ProductItem from "../products/fashion/product-item";
import InventoryFilter from "./shop-filter/inventory-filter";
import SettingFilter from "./shop-filter/setting-filter";
import MetalFilter from "./shop-filter/metal-filter";
import ShapeFilter from "./shop-filter/shape-filter";
import PriceFilter from "./shop-filter/price-filter";
import CertificateFilter from "./shop-filter/certificate-filter";
import ProductBrand from "./shop-filter/product-brand";
import StatusFilter from "./shop-filter/status-filter";
import TopRatedProducts from "./shop-filter/top-rated-products";
import ShopListItem from "./shop-list-item";
import ShopTopLeft from "./shop-top-left";
import ShopTopRight from "./shop-top-right";
import ResetButton from "./shop-filter/reset-button";

const ShopArea = ({ all_products, products, otherProps }) => {
  const { priceFilterValues, selectHandleFilter, currPage, setCurrPage } = otherProps;
  const [filteredRows, setFilteredRows] = useState(products);
  const [pageStart, setPageStart] = useState(0);
  const [countOfPage, setCountOfPage] = useState(25);

  const paginatedData = (items, startPage, pageCount) => {
    setFilteredRows(items);
    setPageStart(startPage);
    setCountOfPage(pageCount);
  };

  // max price
  const maxPrice = all_products.reduce((max, product) => {
    return product.price > max ? product.price : max;
  }, 0);
  return (
    <>
      <section className="tp-shop-area pb-120">
        <div className="container-fluid" style={{ padding: '0 40px' }}>
          <div className="row">
            <div className="col-xl-2 col-lg-2">
              <div className="tp-shop-sidebar mr-10">
                {/* status */}
                <StatusFilter setCurrPage={setCurrPage} />
                {/* inventory hierarchy */}
                <InventoryFilter setCurrPage={setCurrPage} />
                {/* setting type removed */}
                {/* metal id */}
                <MetalFilter setCurrPage={setCurrPage} />
                {/* shape */}
                <ShapeFilter setCurrPage={setCurrPage} />
                {/* certificate */}
                <CertificateFilter setCurrPage={setCurrPage} />
                {/* filter (size, carat, price) */}
                <PriceFilter
                  priceFilterValues={priceFilterValues}
                  maxPrice={maxPrice}
                />
                {/* product rating */}
                {/* <TopRatedProducts /> */}
                {/* brand */}
                {/* <ProductBrand setCurrPage={setCurrPage} /> */}
                {/* reset filter */}
                <ResetButton />
              </div>
            </div>
            <div className="col-xl-10 col-lg-10">
              <div className="tp-shop-main-wrapper">


                <div className="tp-shop-top mb-45">
                  <div className="row">
                    <div className="col-xl-6">
                      <ShopTopLeft
                        showing={
                          products.length === 0
                            ? 0
                            : filteredRows.slice(
                              pageStart,
                              pageStart + countOfPage
                            ).length
                        }
                        total={all_products.length}
                      />
                    </div>
                    <div className="col-xl-6">
                      <ShopTopRight selectHandleFilter={selectHandleFilter} />
                    </div>
                  </div>
                </div>
                {products.length === 0 && <h2>No products found</h2>}
                {products.length > 0 && (
                  <div className="tp-shop-items-wrapper tp-shop-item-primary">
                    <div className="tab-content" id="productTabContent">
                      <div
                        className="tab-pane fade show active"
                        id="grid-tab-pane"
                        role="tabpanel"
                        aria-labelledby="grid-tab"
                        tabIndex="0"
                      >
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5">
                          {filteredRows
                            .slice(pageStart, pageStart + countOfPage)
                            .map((item, i) => (
                              <div
                                key={item?._id || item?.id || i}
                                className="col"
                              >
                                <ProductItem product={item} />
                              </div>
                            ))}
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="list-tab-pane"
                        role="tabpanel"
                        aria-labelledby="list-tab"
                        tabIndex="0"
                      >
                        <div className="tp-shop-list-wrapper tp-shop-item-primary mb-70">
                          <div className="table-responsive">
                            <table className="table table-hover align-middle text-nowrap" style={{ fontSize: '14px' }}>
                              <thead className="table-light text-muted" style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>
                                <tr>
                                  <th scope="col" style={{ width: '80px' }}></th>
                                  <th scope="col">LOT NAME</th>
                                  <th scope="col">SHAPE</th>
                                  <th scope="col">COLOR</th>
                                  <th scope="col">CAT / SUBCAT</th>
                                  <th scope="col">SETTING TYPE</th>
                                  <th scope="col">METAL ID</th>
                                  <th scope="col">TOTAL QTY DIAMOND</th>
                                  <th scope="col">PRICE</th>
                                  <th scope="col" style={{ width: '80px' }}></th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredRows
                                  .slice(pageStart, pageStart + countOfPage)
                                  .map((item, i) => (
                                    <ShopListItem key={item?._id || item?.id || i} product={item} />
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {products.length > 0 && (
                  <div className="tp-shop-pagination mt-20">
                    <div className="tp-pagination">
                      <Pagination
                        items={products}
                        countOfPage={25}
                        paginatedData={paginatedData}
                        currPage={currPage}
                        setCurrPage={setCurrPage}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopArea;
