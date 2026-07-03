import React from 'react';
import SEO from '../components/seo';
import HeaderTwo from '../layout/headers/header-2';
import FooterTwo from '../layout/footers/footer-2';
import SizeGuideArea from '../components/size-guide/size-guide-area';

const SizeGuide = () => {
  return (
    <div className="wrapper">
      <SEO pageTitle="Size Guide" />
      <HeaderTwo />
      <SizeGuideArea />
      <FooterTwo />
    </div>
  );
};

export default SizeGuide;
