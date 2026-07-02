import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// internal
import about_img from '@assets/img/about/about-1.jpg';
import about_thumb from '@assets/img/about/about-2.jpg';
import { ArrowRightLong } from '@/svg';

const JewelryAbout = ({ settings }) => {
  const about = settings?.aboutSection || {
    title: "Shop our limited Edition Collaborations",
    subtitle: "Unity Collection",
    mainImg: about_img,
    floatingImg: about_thumb,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n Cras vel mi quam. Fusce vehicula vitae mauris sit amet tempor. Donec consectetur lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna."
  };

  const getImgSrc = (img) => {
    if (typeof img === 'string') return img;
    return img.src || img; // For local static imports
  };
  return (
    <>
      <section className="tp-about-area pt-125 pb-180">
        <div className="container">
          <div className="row">
            <div className="col-xl-5 col-lg-6">
              <div className="tp-about-thumb-wrapper p-relative mr-35">
                <div className="tp-about-thumb m-img">
                  {typeof about.mainImg === 'string' ? <img src={getImgSrc(about.mainImg)} alt="about_img" style={{width: '100%'}}/> : <Image src={about.mainImg} alt="about_img" />}
                </div>
                <div className="tp-about-thumb-2">
                  {typeof about.floatingImg === 'string' ? <img src={getImgSrc(about.floatingImg)} alt="about_thumb" style={{width: '100%'}}/> : <Image src={about.floatingImg} alt="about_thumb" />}
                </div>
              </div>
            </div>
            <div className="col-xl-7 col-lg-6">
              <div className="tp-about-wrapper pl-80 pt-75 pr-60">
                <div className="tp-section-title-wrapper-4 mb-50">
                  <span className="tp-section-title-pre-4">{about.subtitle}</span>
                  <h3 className="tp-section-title-4 fz-50">{about.title}</h3>
                </div>
                <div className="tp-about-content pl-120">
                  <p>{about.description}</p>

                  <div className="tp-about-btn">
                    <Link href="/contact" className="tp-btn">
                      Contact Us{" "}<ArrowRightLong />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default JewelryAbout;
