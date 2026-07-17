import React from 'react';
// internal
import { useGetProductTypeQuery } from '@/redux/features/productApi';
import ProductItem from './product-item';
import ErrorMsg from '@/components/common/error-msg';
import { HomeTwoPopularPrdLoader } from '@/components/loader';

const PopularProducts = () => {
  const { data: products, isError, isLoading } =
    useGetProductTypeQuery({ type: 'jewelry', query: `new=true` });

  let content = null;

  if (isLoading) {
    content = <HomeTwoPopularPrdLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    // Filter out watches and LGD, then pick the 4 most expensive
    const jewelleryProducts = products.data.filter(p => {
      const cat = (p.parent || p.children || '').toLowerCase();
      return !cat.includes('watch') && !cat.includes('lgd');
    });

    // Sort by price descending, take top 4
    const top4Expensive = [...jewelleryProducts]
      .sort((a, b) => (b.price || 0) - (a.price || 0))
      .slice(0, 4);

    content = (
      <div className="row justify-content-center">
        {top4Expensive.map((product) => (
          <div key={product?.id || product?._id} className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
            <ProductItem product={product} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <section className="tp-category-area pt-115 pb-80 tp-category-plr-85" style={{ backgroundColor: `#EFF1F5` }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-4 mb-60 text-center">
                <span className="tp-section-title-pre-4">Shop by Category</span>
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

export default PopularProducts;
