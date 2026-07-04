import React, { useEffect, useState } from 'react';
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderFour from '@/layout/headers/header-4';
import JewelryBanner from '@/components/banner/jewelry-banner';
import JewelryShopBanner from '@/components/shop-banner/jewelry-shop-banner';
import JewelryAbout from '@/components/about/jewelry-about';
import PopularProducts from '@/components/products/jewelry/popular-products';
import ProductArea from '@/components/products/jewelry/product-area';
import JewelryCollectionBanner from '@/components/shop-banner/jewelry-collection-banner';
import BestSellerPrd from '@/components/products/jewelry/best-seller-prd';
import JewelryBrands from '@/components/brand/jewelry-brands';
import InstagramAreaFour from '@/components/instagram/instagram-area-4';
import FeatureAreaThree from '@/components/features/feature-area-3';
import FooterTwo from '@/layout/footers/footer-2';

export default function Home() {
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
      <SEO pageTitle='Home'/>
      <HeaderFour/>
      <JewelryBanner settings={storefrontSettings} />
      <FeatureAreaThree settings={storefrontSettings} />
      <JewelryShopBanner settings={storefrontSettings} />
      <JewelryAbout settings={storefrontSettings} />
      <PopularProducts/>
      <ProductArea/>
      <JewelryCollectionBanner settings={storefrontSettings} />
      <BestSellerPrd/>

      <InstagramAreaFour settings={storefrontSettings} />
      <FooterTwo settings={storefrontSettings} />
    </Wrapper>
  )
}
