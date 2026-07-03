import React from 'react';
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import FooterTwo from '@/layout/footers/footer-2';
import Wrapper from '@/layout/wrapper';
import OurValuesArea from '@/components/our-values/our-values-area';

const OurValues = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Our Values" />
      <HeaderTwo style_2={true} />
      <main>
        <OurValuesArea />
      </main>
      <FooterTwo />
    </Wrapper>
  );
};

export default OurValues;
