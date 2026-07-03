import React from 'react';
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import FooterTwo from '@/layout/footers/footer-2';
import Wrapper from '@/layout/wrapper';
import OurTeamArea from '@/components/our-team/our-team-area';

const OurTeam = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Our Team" />
      <HeaderTwo style_2={true} />
      <main>
        <OurTeamArea />
      </main>
      <FooterTwo />
    </Wrapper>
  );
};

export default OurTeam;
