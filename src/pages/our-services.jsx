import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer-2";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import OurServicesArea from "@/components/our-services";

const OurServicesPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Our Services" />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Our Services" subtitle="Our Services" center={true} bg_clr={true} />
      <OurServicesArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default OurServicesPage;
