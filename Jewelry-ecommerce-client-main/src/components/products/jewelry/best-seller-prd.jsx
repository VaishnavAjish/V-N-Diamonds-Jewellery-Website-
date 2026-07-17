import React from 'react';
// internal
import ProductItem from './product-item';
import ErrorMsg from '@/components/common/error-msg';
import { useGetProductTypeQuery } from '@/redux/features/productApi';
import { HomeTwoBestSellPrdPrdLoader } from '@/components/loader';

const CATEGORIES = [
  { key: 'ring', label: 'Ring' },
  { key: 'earring', label: 'Earring' },
  { key: 'necklace', label: 'Necklace' },
  { key: 'bracelet', label: 'Bracelet' },
];

const BestSellerPrd = () => {
  const { data: products, isError, isLoading } =
    useGetProductTypeQuery({ type: 'jewelry' });

  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <div className='row'>
        <HomeTwoBestSellPrdPrdLoader loading={isLoading} />
      </div>
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    // Pick one product for each category: Ring, Earring, Necklace, Bracelet
    const categoryProducts = CATEGORIES.map(({ key, label }) => {
      const match = products.data.find(p => {
        const parent = (p.parent || '').toLowerCase();
        const child = (p.children || '').toLowerCase();
        return parent.includes(key) || child.includes(key);
      });
      return { label, product: match };
    }).filter(({ product }) => !!product);

    content = (
      <div className="row justify-content-center">
        {categoryProducts.map(({ label, product }) => (
          <div key={product?.id || product?._id} className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
            <ProductItem product={product} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <section className="tp-best-area pt-115 pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-4 mb-50 text-center">
                <span className="tp-section-title-pre-4">Best Seller This Week&apos;s</span>
                <h3 className="tp-section-title-4">Top Sellers In Jewellery &amp; Diamonds for You</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              {content}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BestSellerPrd;
