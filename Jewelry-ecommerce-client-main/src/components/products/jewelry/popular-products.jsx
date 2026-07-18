import React from 'react';
// internal
import { useGetProductTypeQuery } from '@/redux/features/productApi';
import ProductItem from './product-item';
import ErrorMsg from '@/components/common/error-msg';
import { HomeTwoPopularPrdLoader } from '@/components/loader';

const CATEGORIES = [
  { key: 'ring', label: 'Ring' },
  { key: 'earring', label: 'Earring' },
  { key: 'necklace', label: 'Necklace' },
  { key: 'bracelet', label: 'Bracelet' },
];

const PopularProducts = () => {
  const { data: products, isError, isLoading } =
    useGetProductTypeQuery({ type: 'jewelry' });

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
    // Pick one product from each category: Ring, Earring, Necklace, Bracelet
    const categoryProducts = CATEGORIES.map(({ key }) => {
      return products.data.find(p => {
        const parent = (p.parent || '').toLowerCase();
        const child = (p.children || '').toLowerCase();
        return parent.includes(key) || child.includes(key);
      });
    }).filter(Boolean);

    content = (
      <div className="row justify-content-center">
        {categoryProducts.map((product) => (
          <div key={product?.id || product?._id} className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
            <ProductItem product={product} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <section className="tp-category-area pt-115 pb-80" style={{ backgroundColor: '#EFF1F5' }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-4 mb-60 text-center">
                <span className="tp-section-title-pre-4">Shop by Category</span>
                <h3 className="tp-section-title-4">Top Sellers In Jewellery & Diamonds for You</h3>
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
