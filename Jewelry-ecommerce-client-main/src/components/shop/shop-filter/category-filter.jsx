import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";

const INVENTORY_TAXONOMY = [
  {
    title: 'BASED ON METAL',
    isHeader: true,
    children: [
      {
        title: 'Gold',
        categoryName: 'Gold',
        children: [{ title: '18K' }, { title: '14K' }, { title: '9K' }]
      },
      {
        title: 'Platinum',
        categoryName: 'Platinum',
        children: [{ title: 'PT950' }, { title: 'PT900' }, { title: 'PT850' }]
      },
      {
        title: 'Titanium',
        categoryName: 'Titanium',
        children: [{ title: 'Titanium' }]
      }
    ]
  },
  {
    title: 'STONES',
    isHeader: true,
    children: [
      {
        title: 'DIAMONDS',
        children: [
          {
            title: 'White Diamonds',
            categoryName: 'White Diamonds',
            children: [{ title: 'GIA Diamonds' }, { title: 'Rosecut Diamonds' }, { title: 'Illusion Cut Diamonds' }, { title: 'Fancy Cut Diamonds' }]
          },
          {
            title: 'Fancy Color Diamonds',
            categoryName: 'Fancy Color Diamonds',
            children: [{ title: 'Yellow' }, { title: 'Pink' }, { title: 'Blue' }, { title: 'Green' }, { title: 'Orange' }, { title: 'Brown' }]
          }
        ]
      },
      {
        title: 'GEMSTONES',
        children: [
          {
            title: 'Precious Gemstones',
            children: [
              {
                title: 'Rubies',
                categoryName: 'Rubies',
                children: [{ title: 'Burma - No Heat' }, { title: 'Burma - Heat' }, { title: 'Mozambique - No Heat' }, { title: 'Mozambique - Heat' }]
              },
              {
                title: 'Emeralds',
                categoryName: 'Emeralds',
                children: [{ title: 'Columbia' }, { title: 'Zambia' }]
              },
              {
                title: 'Sapphires',
                categoryName: 'Sapphires',
                children: [{ title: 'Kashmir' }, { title: 'Burma' }, { title: 'SriLanka - No Heat' }, { title: 'SriLanka - Heat' }, { title: 'Madagascar - No Heat' }, { title: 'Madagascar - Heat' }]
              }
            ]
          },
          {
            title: 'Semi-Precious Stones',
            categoryName: 'Semi-Precious Stones',
            children: [
              { title: 'Aquamarines' }, { title: 'Amethysts' }, { title: 'Citrene' }, { title: 'Topaz' }, { title: 'Florite' }, { title: 'Petersite' },
              { title: 'Lemon Quartz' }, { title: 'Rose Quartz' },
              { title: 'Afgan Tourmalines' }, { title: 'Pariaba Tourmalines' },
              { title: 'Turquoises' }, { title: 'Kunzite' }, { title: 'Morganite' },
              { title: 'Burma Spinels' }, { title: 'Vietnam Spinels' }, { title: 'Tanzania Spinels' },
              { title: 'Australian Opals' }, { title: 'Ethopian Opals' },
              { title: 'Indian MoonStones' }, { title: 'African MoonStones' },
              { title: 'Rodholite Garnet' }, { title: 'Spesseratite Garnet' }, { title: 'Tsavorite Garnet' }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'FINE JEWELLERY',
    isHeader: true,
    children: [
      {
        title: 'Fine Jewellery',
        categoryName: 'Fine Jewellery',
        children: [
          { title: 'Diamond Jewellery' },
          { title: 'Gold Jewellery' },
          { title: 'Gemstone Jewellery' }
        ]
      }
    ]
  },
  {
    title: 'HIGH JEWELLERY',
    isHeader: true,
    children: [
      {
        title: 'High Jewellery',
        categoryName: 'High Jewellery',
        children: [
          { title: 'Rare Gemset Jewellery - Bixbite' },
          { title: 'Rare Gemset Jewellery - Pariaba Brazil' },
          { title: 'Rare Gemset Jewellery - Pariaba Mozambique' },
          { title: 'Semi Precious Jewellery' }
        ]
      }
    ]
  }
];

const CategoryFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleRoute = (catName, subCatName) => {
    setCurrPage(1);
    const newQuery = { ...router.query };
    
    if (catName) {
      newQuery.category = catName.toLowerCase().replace("&", "").split(" ").join("-");
    }
    if (subCatName) {
      newQuery.subCategory = subCatName.toLowerCase().replace("&", "").split(" ").join("-");
    } else {
      delete newQuery.subCategory;
    }

    router.push({ pathname: `/${shop_right ? 'shop-right-sidebar' : 'shop'}`, query: newQuery });
    dispatch(handleFilterSidebarClose());
  };

  const renderTree = (nodes, level = 0, parentCategoryName = null) => {
    return (
      <ul style={{ listStyle: 'none', paddingLeft: level === 0 ? 0 : '15px', margin: 0 }}>
        {nodes.map((node, i) => {
          const isLeaf = !node.children || node.children.length === 0;
          const currentCategoryName = node.categoryName || parentCategoryName;
          
          let isActive = false;
          if (currentCategoryName) {
            const catSlug = currentCategoryName.toLowerCase().replace("&", "").split(" ").join("-");
            if (isLeaf) {
              const subSlug = node.title.toLowerCase().replace("&", "").split(" ").join("-");
              isActive = router.query.category === catSlug && router.query.subCategory === subSlug;
            } else if (node.categoryName && !node.isHeader) {
              isActive = router.query.category === catSlug && !router.query.subCategory;
            }
          }

          return (
            <li key={i} style={{ marginBottom: node.isHeader ? '15px' : '6px' }}>
              {node.isHeader ? (
                <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', marginTop: level === 0 && i > 0 ? '20px' : '0', fontWeight: 'bold' }}>
                  {node.title}
                </div>
              ) : (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isLeaf) {
                      handleRoute(currentCategoryName, node.title);
                    } else if (node.categoryName) {
                      handleRoute(node.categoryName, null);
                    }
                  }}
                  style={{
                    cursor: (isLeaf || node.categoryName) ? 'pointer' : 'default',
                    fontSize: level === 0 ? '14px' : level === 1 ? '13px' : '12px',
                    fontWeight: level === 0 ? '600' : level === 1 ? '500' : '400',
                    color: isActive ? '#1a73e8' : (level === 0 ? '#333' : '#666'),
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px 0',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={e => {
                    if ((isLeaf || node.categoryName) && !isActive) e.target.style.color = '#1a73e8';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.target.style.color = level === 0 ? '#333' : '#666';
                  }}
                >
                  {node.title}
                </div>
              )}
              {node.children && renderTree(node.children, level + 1, currentCategoryName)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="tp-shop-widget mb-50">
      <div style={{ paddingBottom: '10px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
        <h3 className="tp-shop-widget-title" style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
          CATEGORIZATION OF INVENTORY
        </h3>
      </div>
      <div className="tp-shop-widget-content" style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
        {renderTree(INVENTORY_TAXONOMY)}
      </div>
    </div>
  );
};

export default CategoryFilter;
