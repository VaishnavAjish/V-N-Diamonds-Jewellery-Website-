import React from 'react';
// internal
import ProductItem from './product-item';
import ErrorMsg from '@/components/common/error-msg';
import { useGetProductTypeQuery } from '@/redux/features/productApi';
import { HomeTwoBestSellPrdPrdLoader } from '@/components/loader';

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
    // Sort by price descending, take top 4 most expensive
    const top4 = [...products.data]
      .filter(p => {
        const cat = (p.parent || p.children || '').toLowerCase();
        return !cat.includes('watch') && !cat.includes('lgd');
      })
      .sort((a, b) => (b.price || 0) - (a.price || 0))
      .slice(0, 4);

    content = (
      <div className="row justify-content-center">
        {top4.map((item) => (
          <div key={item?.id || item?._id} className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
            <ProductItem product={item} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <section className="tp-best-area pt-115 pb-80" style={{ backgroundColor: '#EFF1F5' }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-4 mb-50 text-center">
                <span className="tp-section-title-pre-4">Best Seller This Week&apos;s</span>
                <h3 className="tp-section-title-4">Exquisite by the House of Harene Jewels.</h3>
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
