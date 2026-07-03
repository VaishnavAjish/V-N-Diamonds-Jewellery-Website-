import React from 'react';
import ShopPage from '../shop';

const ProductCategoryPage = ({ query }) => {
  return <ShopPage query={query} />;
};

export const getServerSideProps = async (context) => {
  const { slug } = context.query;
  
  let category = slug?.[0] || null;
  let subCategory = slug?.[1] || null;

  // Handle the artificial groupings from the frontend menu
  if (category === 'fine-jewellery') {
    if (subCategory) {
      category = subCategory;
      subCategory = slug?.[2] || null;
    } else {
      category = 'rings,earrings,pendants,bracelets,necklaces,brooches,cufflinks,belly-button,watches,collets';
    }
  } else if (category === 'diamonds') {
    category = null; // Do not filter by parent
    if (!subCategory) subCategory = 'diamond';
  } else if (category === 'precious-gemstones') {
    category = null;
    if (!subCategory) subCategory = 'ruby,emerald,sapphire';
  } else if (category === 'semi-precious-gemstones') {
    category = null;
    if (!subCategory) subCategory = 'tourmaline,tanzanite,aquamarine,garnet,rodolite';
  } else if (category === 'rare-collectorsgemstones') {
    category = null;
    if (!subCategory) subCategory = 'bixbite,grandidierite,benitoite,alexandrite';
  }

  const query = {
    category,
    subCategory,
  };

  return {
    props: {
      query,
    },
  };
};

export default ProductCategoryPage;
