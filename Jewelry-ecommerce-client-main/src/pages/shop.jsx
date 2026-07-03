import React, { useState, useEffect } from "react";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopArea from "@/components/shop/shop-area";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import ErrorMsg from "@/components/common/error-msg";
import Footer from "@/layout/footers/footer";
import ShopFilterOffCanvas from "@/components/common/shop-filter-offcanvas";
import ShopLoader from "@/components/loader/shop/shop-loader";

const ShopPage = ({ query }) => {
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  const [priceValue, setPriceValue] = useState([0, 0]);
  const [selectValue, setSelectValue] = useState("");
  const [currPage, setCurrPage] = useState(1);
  // Load the maximum price once the products have been loaded
  useEffect(() => {
    if (!isLoading && !isError && products?.data?.length > 0) {
      const maxPrice = products.data.reduce((max, product) => {
        return product.price > max ? product.price : max;
      }, 0);
      setPriceValue([0, maxPrice]);
    }
  }, [isLoading, isError, products]);

  // handleChanges
  const handleChanges = (val) => {
    setCurrPage(1);
    setPriceValue(val);
  };

  // selectHandleFilter
  const selectHandleFilter = (e) => {
    setSelectValue(e.value);
  };

  // other props
  const otherProps = {
    priceFilterValues: {
      priceValue,
      handleChanges,
    },
    selectHandleFilter,
    currPage,
    setCurrPage,
  };
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopLoader loading={isLoading}/>;
  }
  if (!isLoading && isError) {
    content = <div className="pb-80 text-center"><ErrorMsg msg="There was an error" /></div>;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    // products
    let product_items = products.data;
    // select short filtering
    if (selectValue) {
      if (selectValue === "Default Sorting") {
        product_items = products.data;
      } else if (selectValue === "Low to High") {
        product_items = products.data
          .slice()
          .sort((a, b) => Number(a.price) - Number(b.price));
      } else if (selectValue === "High to Low") {
        product_items = products.data
          .slice()
          .sort((a, b) => Number(b.price) - Number(a.price));
      } else if (selectValue === "New Added") {
        product_items = products.data
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (selectValue === "On Sale") {
        product_items = products.data.filter((p) => p.discount > 0);
      } else {
        product_items = products.data;
      }
    }
    // price filter
    product_items = product_items.filter(
      (p) => p.price >= priceValue[0] && p.price <= priceValue[1]
    );

    // status filter
    if (query.status) {
      if (query.status === "on-sale") {
        product_items = product_items.filter((p) => p.discount > 0);
      } else if (query.status === "in-stock") {
        product_items = product_items.filter((p) => p.status === "in-stock");
      }
    }

    // combined category and subCategory filter
    if (query.category || query.subCategory) {
      let targetCategories = query.category ? query.category.split(',') : [];
      // Hack for fine-jewellery since database stores them as Rings, Earrings, etc. as parent
      if (targetCategories.includes('fine-jewellery')) {
        targetCategories.push('rings', 'earrings', 'pendants', 'pendent', 'bracelets', 'necklaces', 'brooches', 'brooch', 'cufflinks');
      }
      
      const targetSubCategories = query.subCategory ? query.subCategory.split(',') : [];

      product_items = product_items.filter((p) => {
        const parentSlug = p.parent?.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-");
        
        const flatParent = p.parent?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
        const flatChildren = p.children?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
        const flatTitle = p.title?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
        
        let matchCat = false;
        let matchSub = false;

        // Check Category
        if (targetCategories.length > 0) {
          for (let target of targetCategories) {
            const flatTarget = target.toLowerCase().replace(/[^a-z0-9]/g, "");
            const cleanFlatTarget = flatTarget.replace("diamonds", "").replace("rarecollectorsgemstones", "").replace("finejewellery", "");
            
            const searchStr = cleanFlatTarget.length > 2 ? cleanFlatTarget : flatTarget;

            if (flatParent === searchStr || flatParent.includes(searchStr) || (flatParent.length > 3 && searchStr.includes(flatParent))) {
              matchCat = true;
            } else if (flatChildren === searchStr || flatChildren.includes(searchStr) || (flatChildren.length > 3 && searchStr.includes(flatChildren))) {
              matchCat = true;
            } else if (flatTitle && (flatTitle.includes(searchStr) || (flatTitle.length > 3 && searchStr.includes(flatTitle)))) {
              matchCat = true;
            }
          }
        } else {
          matchCat = true; // No category filter applied
        }

        // Check SubCategory
        if (targetSubCategories.length > 0) {
          for (let target of targetSubCategories) {
            const flatTarget = target.toLowerCase().replace(/[^a-z0-9]/g, "");
            const cleanFlatTarget = flatTarget.replace("diamonds", "").replace("rarecollectorsgemstones", "").replace("finejewellery", "");
            
            // If target is effectively empty after cleaning, use the original flatTarget
            const searchStr = cleanFlatTarget.length > 2 ? cleanFlatTarget : flatTarget;

            if (flatChildren === searchStr || flatChildren.includes(searchStr) || (flatChildren.length > 3 && searchStr.includes(flatChildren))) {
              matchSub = true;
            } else if (flatTitle && (flatTitle.includes(searchStr) || (flatTitle.length > 3 && searchStr.includes(flatTitle)))) {
              matchSub = true;
            } else if (flatParent === searchStr || flatParent.includes(searchStr) || flatParent === searchStr.replace("pendants", "pendent") || (flatParent.length > 3 && searchStr.includes(flatParent))) {
              matchSub = true;
            } else if (searchStr.includes("gia")) {
              const certObj = p.additionalInformation?.find(info => info.key.toLowerCase() === 'certificate');
              if (certObj && certObj.value.toLowerCase().replace(/[^a-z0-9]/g, "").includes('gia')) matchSub = true;
              const flatTags = (p.tags || []).map(t => t.toLowerCase().replace(/[^a-z0-9]/g, ""));
              if (flatTags.some(t => t.includes('gia'))) matchSub = true;
            }
          }
        } else {
          matchSub = true; // No subCategory filter applied
        }

        // Priority to subcategory match if one was requested
        if (targetSubCategories.length > 0) {
            return matchSub;
        }
        
        return matchCat;
      });
    }

    // setting type filter
    if (query.setting) {
      product_items = product_items.filter((p) => {
        const titleSlug = p.title?.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-");
        const settingSlug = p.settingType?.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-");
        const tagsSlug = (p.tags || []).map(t => t.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-"));
        return (settingSlug === query.setting) || (titleSlug && titleSlug.includes(query.setting)) || tagsSlug.includes(query.setting);
      });
    }

    // metal id filter (Metals were saved in tags)
    if (query.metal) {
      product_items = product_items.filter((p) => {
        const tagsSlug = (p.tags || []).map(t => t.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-"));
        return tagsSlug.includes(query.metal);
      });
    }

    // shape filter (Shapes were also saved in tags)
    if (query.shape) {
      product_items = product_items.filter((p) => {
        const tagsSlug = (p.tags || []).map(t => t.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-"));
        return tagsSlug.includes(query.shape);
      });
    }

    // color filter
    if (query.color) {
      product_items = product_items.filter((product) => {
        for (let i = 0; i < product.imageURLs.length; i++) {
          const color = product.imageURLs[i]?.color;
          if (
            color &&
            color?.name.toLowerCase().replace("&", "").split(" ").join("-") ===
              query.color
          ) {
            return true; // match found, include product in result
          }
        }
        return false; // no match found, exclude product from result
      });
    }

    // certificate filter (checking additionalInformation)
    if (query.certificate) {
      product_items = product_items.filter((p) => {
        if (!p.additionalInformation) return false;
        const certObj = p.additionalInformation.find(info => info.key.toLowerCase() === 'certificate');
        if (!certObj) return false;
        const certSlug = certObj.value.toLowerCase().replace(/&/g, "").replace(/\//g, "-").split(" ").join("-");
        return certSlug === query.certificate;
      });
    }

    // brand filter
    if (query.brand) {
      product_items = product_items.filter(
        (p) =>
          p.brand.name.toLowerCase().replace("&", "").split(" ").join("-") ===
          query.brand
      );
    }

    content = (
      <>
        <ShopArea
          all_products={products.data}
          products={product_items}
          otherProps={otherProps}
        />
        <ShopFilterOffCanvas
          all_products={products.data}
          otherProps={otherProps}
        />
      </>
    );
  }
  return (
    <Wrapper>
      <SEO pageTitle="Shop" />
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb title="Shop Grid" subtitle="Shop Grid" />
      <div style={{ minHeight: 'calc(100vh - 400px)' }}>
        {content}
      </div>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ShopPage;

export const getServerSideProps = async (context) => {
  const { query } = context;

  return {
    props: {
      query,
    },
  };
};
