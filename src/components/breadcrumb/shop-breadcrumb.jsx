import React from 'react';

const ShopBreadcrumb = ({title,subtitle}) => {
  return (
    <>
      <section className="breadcrumb__area include-bg pt-30 pb-20" style={{ textAlign: 'left' }}>
        <div className="container-fluid" style={{ paddingLeft: '50px' }}>
          <div className="row">
            <div className="col-xxl-12">
              <div className="breadcrumb__content p-relative z-index-1" style={{ textAlign: 'left' }}>
                <h3 className="breadcrumb__title" style={{ fontSize: '36px', fontWeight: '500', marginBottom: '10px' }}>{title}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopBreadcrumb;
