import ErrorMsg from '@/components/common/error-msg';
import { useGetProductTypeQuery } from '@/redux/features/productApi';
import React, { useEffect, useRef, useState } from 'react';
import ProductItem from './product-item';
import { HomeTwoPrdLoader } from '@/components/loader';
import Link from 'next/link';

// tabs
const tabs = ['Our Collections'];

const ProductArea = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const activeRef = useRef(null);
  const marker = useRef(null);
  const { data: products, isError, isLoading } = useGetProductTypeQuery({ type: 'jewelry' });
  // handleActiveTab
  useEffect(() => {
    // Position the marker after the active tab has been updated
    if (activeRef.current && marker.current) {
      marker.current.style.left = activeRef.current.offsetLeft + "px";
      marker.current.style.width = activeRef.current.offsetWidth + "px";
    }
  }, [activeTab, products]);

  const handleActiveTab = (e, tab) => {
    setActiveTab(tab);
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <HomeTwoPrdLoader loading={isLoading} />
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {

    // filter out watches and LGD
    const base_product_items = products.data.filter(p => {
      const cat = (p.parent || '').toLowerCase();
      const subCat = (p.children || '').toLowerCase();
      return !cat.includes('watch') && !subCat.includes('watch') && !cat.includes('lgd') && !subCat.includes('lgd');
    });

    let product_items = base_product_items;
    if (activeTab === 'Our Collections') {
      product_items = base_product_items;
    } else {
      product_items = base_product_items.filter(p => {
        let cat = p.children?.toLowerCase() || p.category?.name?.toLowerCase() || p.parent?.toLowerCase() || '';
        // normalize plurals
        if (cat === 'earring') cat = 'earrings';
        if (cat === 'bracelet') cat = 'bracelets';
        if (cat === 'necklace') cat = 'necklaces';
        if (cat === 'ring') cat = 'rings';
        if (cat === 'pendant') cat = 'pendants';
        
        let tab = activeTab.toLowerCase();
        if (tab === 'pendant') tab = 'pendants';

        return cat === tab;
      });
    }
    content = <>
      <div className="row align-items-end">
        <div className="col-xl-6 col-lg-6">
          <div className="tp-section-title-wrapper-4 mb-40 text-center text-lg-start">
            <span className="tp-section-title-pre-4">Product Collection</span>
            <h3 className="tp-section-title-4">Discover our Products</h3>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6">
          <div className="tp-product-tab-2 tp-product-tab-3  tp-tab mb-45">
            <div className="tp-product-tab-inner-3 d-flex align-items-center justify-content-center justify-content-lg-end">
              <nav>
                <div className="nav nav-tabs justify-content-center tp-product-tab tp-tab-menu p-relative" id="nav-tab" role="tablist">

                  {tabs.map((tab, i) => (
                    <button
                      key={i}
                      ref={activeTab === tab ? activeRef : null}
                      onClick={(e) => handleActiveTab(e, tab)}
                      className={`nav-link text-capitalize ${activeTab === tab ? "active" : ""}`}
                    >
                      {tab.split("-").join(" ")}
                    </button>
                  ))}

                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {product_items.slice(0, 8).map((prd, i) => (
          <div key={prd?._id || prd?.id || i} className="col-xl-3 col-lg-4 col-sm-6">
            <ProductItem product={prd} />
          </div>
        ))}
      </div>
      <div className="row justify-content-center">
        <div className="col-xl-12">
          <div className="tp-product-more-4 text-center mt-40">
            <Link href="/shop" className="tp-btn tp-btn-border">
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </>
  }


  return (
    <>
      <section className="tp-product-area pt-115 pb-80">
        <div className="container">
          {content}
        </div>
      </section>
    </>
  );
};

export default ProductArea;
