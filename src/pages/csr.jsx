import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import CsrArea from "@/components/csr/csr-area";

const CsrPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="CSR" />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="CSR" subtitle="CSR" center={true} bg_clr={true} />
      <CsrArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default CsrPage;
