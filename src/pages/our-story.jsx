import React from 'react';
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import FooterTwo from '@/layout/footers/footer-2';
import Wrapper from '@/layout/wrapper';
import OurStoryArea from '@/components/our-story/our-story-area';

const OurStory = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Our Story" />
      <HeaderTwo style_2={true} />
      <main>
        <OurStoryArea />
      </main>
      <FooterTwo />
    </Wrapper>
  );
};

export default OurStory;
