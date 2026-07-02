import React from 'react';
import SEO from '../components/seo';
import HeaderTwo from '../layout/headers/header-2';
import FooterTwo from '../layout/footers/footer-2';
import EducationArea from '../components/education/education-area';

const EducationPage = () => {
  return (
    <>
      <SEO pageTitle="Education" />
      <HeaderTwo style_2={true} />
      <main>
        <EducationArea />
      </main>
      <FooterTwo primary_style={true} />
    </>
  );
};

export default EducationPage;
