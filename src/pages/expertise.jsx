import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import ExpertiseArea from "@/components/expertise/expertise-area";

const ExpertisePage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Expertise" />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Expertise" subtitle="Expertise" center={true} bg_clr={true} />
      <ExpertiseArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ExpertisePage;
