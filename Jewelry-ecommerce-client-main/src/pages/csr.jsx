import React, { useEffect, useState } from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import CsrArea from "@/components/csr/csr-area";

const CsrPage = () => {
  const [storefrontSettings, setStorefrontSettings] = useState(null);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/api/settings/storefront')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStorefrontSettings(data.data);
      })
      .catch(err => console.error("Failed to load settings:", err));
  }, []);

  return (
    <Wrapper>
      <SEO pageTitle="CSR" />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="CSR" subtitle="CSR" center={true} bg_clr={true} />
      <CsrArea settings={storefrontSettings} />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default CsrPage;
