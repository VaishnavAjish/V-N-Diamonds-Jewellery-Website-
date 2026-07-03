import React from 'react';
import { feature_data } from './feature-area-2';

const FeatureAreaThree = ({ settings }) => {
  const items = settings?.featureItems?.length > 0
    ? feature_data.map((item, i) => ({ icon: item.icon, ...settings.featureItems[i] }))
    : feature_data;

  return (
    <section className="tp-feature-area tp-feature-border-3 tp-feature-style-2 pb-40 pt-45">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-feature-inner-2 d-flex flex-wrap align-items-center justify-content-between">
              {items.map((item,i) => (
              <div key={i} className="tp-feature-item-2 d-flex align-items-start mb-40">
                <div className="tp-feature-icon-2 mr-10">
                  <span>
                   {item.icon}
                  </span>
                </div>
                <div className="tp-feature-content-2">
                  <h3 className="tp-feature-title-2">{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureAreaThree;
