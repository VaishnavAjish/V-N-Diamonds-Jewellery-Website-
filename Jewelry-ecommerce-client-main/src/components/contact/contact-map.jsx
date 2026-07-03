import React from 'react';
import Lottie from 'lottie-react';
import locationAnimation from './location-animation.json';

const ContactMap = () => {
  return (
    <>
      <section className="tp-map-area pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-map-wrapper">
                <div className="tp-map-hotspot" style={{ top: 'calc(50% - 35px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lottie animationData={locationAnimation} style={{ width: 70, height: 70 }} />
                  </div>
                </div>
                <div className="tp-map-iframe">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3691.8!2d114.1747291!3d22.2981918!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x340401d21d96f2cf%3A0x768cc49597bbdb16!2sVN%20Diamonds!5e0!3m2!1sen!2sus!4v1717277645164!5m2!1sen!2sus"></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactMap;
