import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer-2";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import CareInstructionsArea from "@/components/care-instructions/care-instructions-area";

const CareInstructionsPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Care Instructions" />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Care Instructions" subtitle="Care Instructions" center={true} bg_clr={true} />
      <CareInstructionsArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default CareInstructionsPage;
