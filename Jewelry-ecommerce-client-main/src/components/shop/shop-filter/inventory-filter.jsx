import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";

// Full inventory tree
const INVENTORY_TREE = [
  {
    label: "Based on Metal",
    children: [
      {
        label: "Gold",
        children: [
          { label: "18K", filter: { metal: "18k" } },
          { label: "14K", filter: { metal: "14k" } },
          { label: "9K", filter: { metal: "9k" } },
        ],
      },
      {
        label: "Platinum",
        children: [
          { label: "PT950", filter: { metal: "pt950" } },
          { label: "PT900", filter: { metal: "pt900" } },
          { label: "PT850", filter: { metal: "pt850" } },
        ],
      },
      {
        label: "Titanium",
        filter: { metal: "titanium" },
      },
    ],
  },
  {
    label: "Based on Stones",
    children: [
      {
        label: "Diamonds",
        children: [
          {
            label: "White Diamonds",
            children: [
              { label: "GIA Diamonds", filter: { category: "gia-diamonds" } },
              { label: "Rosecut Diamonds", filter: { category: "rosecut-diamonds" } },
              { label: "Illusion Cut Diamonds", filter: { category: "illusion-cut-diamonds" } },
              { label: "Fancy Cut Diamonds", filter: { category: "fancy-cut-diamonds" } },
            ],
          },
          {
            label: "Fancy Color Diamonds",
            children: [
              { label: "Yellow", filter: { category: "yellow-diamonds" } },
              { label: "Pink", filter: { category: "pink-diamonds" } },
              { label: "Blue", filter: { category: "blue-diamonds" } },
              { label: "Green", filter: { category: "green-diamonds" } },
              { label: "Orange", filter: { category: "orange-diamonds" } },
              { label: "Brown", filter: { category: "brown-diamonds" } },
            ],
          },
        ],
      },
      {
        label: "Gemstones",
        children: [
          {
            label: "Precious Gemstones",
            children: [
              {
                label: "Rubies",
                children: [
                  {
                    label: "Burma",
                    children: [
                      { label: "No Heat", filter: { category: "burma-ruby-no-heat" } },
                      { label: "Heat", filter: { category: "burma-ruby-heat" } },
                    ],
                  },
                  {
                    label: "Mozambique",
                    children: [
                      { label: "No Heat", filter: { category: "mozambique-ruby-no-heat" } },
                      { label: "Heat", filter: { category: "mozambique-ruby-heat" } },
                    ],
                  },
                ],
              },
              {
                label: "Emeralds",
                children: [
                  { label: "Columbia", filter: { category: "columbia-emerald" } },
                  { label: "Zambia", filter: { category: "zambia-emerald" } },
                ],
              },
              {
                label: "Sapphires",
                children: [
                  { label: "Kashmir", filter: { category: "kashmir-sapphire" } },
                  { label: "Burma", filter: { category: "burma-sapphire" } },
                  {
                    label: "Sri Lanka",
                    children: [
                      { label: "No Heat", filter: { category: "srilanka-sapphire-no-heat" } },
                      { label: "Heat", filter: { category: "srilanka-sapphire-heat" } },
                    ],
                  },
                  {
                    label: "Madagascar",
                    children: [
                      { label: "No Heat", filter: { category: "madagascar-sapphire-no-heat" } },
                      { label: "Heat", filter: { category: "madagascar-sapphire-heat" } },
                    ],
                  },
                ],
              },
            ],
          },
          {
            label: "Semi-Precious Stones",
            children: [
              { label: "Aquamarines", filter: { category: "aquamarines" } },
              { label: "Amethysts", filter: { category: "amethysts" } },
              { label: "Citrine", filter: { category: "citrine" } },
              { label: "Topaz", filter: { category: "topaz" } },
              { label: "Fluorite", filter: { category: "fluorite" } },
              { label: "Pietersite", filter: { category: "pietersite" } },
              {
                label: "Quartz",
                children: [
                  { label: "Lemon", filter: { category: "lemon-quartz" } },
                  { label: "Rose", filter: { category: "rose-quartz" } },
                ],
              },
              {
                label: "Tourmalines",
                children: [
                  { label: "Afghan Tourmalines", filter: { category: "afghan-tourmalines" } },
                  { label: "Paraiba Tourmalines", filter: { category: "paraiba-tourmalines" } },
                ],
              },
              { label: "Turquoises", filter: { category: "turquoises" } },
              { label: "Kunzite", filter: { category: "kunzite" } },
              { label: "Morganite", filter: { category: "morganite" } },
              {
                label: "Spinels",
                children: [
                  { label: "Burma", filter: { category: "burma-spinels" } },
                  { label: "Vietnam", filter: { category: "vietnam-spinels" } },
                  { label: "Tanzania", filter: { category: "tanzania-spinels" } },
                ],
              },
              {
                label: "Opals",
                children: [
                  { label: "Australian", filter: { category: "australian-opals" } },
                  { label: "Ethiopian", filter: { category: "ethiopian-opals" } },
                ],
              },
              {
                label: "Moonstones",
                children: [
                  { label: "Indian", filter: { category: "indian-moonstones" } },
                  { label: "African", filter: { category: "african-moonstones" } },
                ],
              },
              {
                label: "Garnet",
                children: [
                  { label: "Rhodolite", filter: { category: "rhodolite-garnet" } },
                  { label: "Spessartite (Fanta)", filter: { category: "spessartite-garnet" } },
                  { label: "Tsavorite", filter: { category: "tsavorite-garnet" } },
                ],
              },
            ],
          },
        ],
      },
      {
        label: "Fine Jewellery",
        children: [
          { label: "Diamond Jewellery", filter: { category: "diamond-jewellery" } },
          { label: "Gold Jewellery", filter: { category: "gold-jewellery" } },
          { label: "Gemstone Jewellery", filter: { category: "gemstone-jewellery" } },
        ],
      },
      {
        label: "High Jewellery",
        children: [
          {
            label: "Rare Gemset Jewellery",
            children: [
              { label: "Bixbite (Red Emerald)", filter: { category: "bixbite-red-emerald" } },
              {
                label: "Paraiba Tourmaline",
                children: [
                  { label: "Brazil", filter: { category: "brazil-paraiba-tourmaline" } },
                  { label: "Mozambique", filter: { category: "mozambique-paraiba-tourmaline" } },
                ],
              },
            ],
          },
          { label: "Semi Precious Jewellery", filter: { category: "semi-precious-jewellery" } },
        ],
      },
    ],
  },
];

// Recursive tree node component
const TreeNode = ({ node, depth = 0, router, setCurrPage, dispatch, shop_right }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isSection = depth === 0;

  // auto-expand top level
  const [open, setOpen] = useState(depth < 2);

  const isActive = node.filter
    ? Object.entries(node.filter).every(([k, v]) => router.query[k] === v)
    : false;

  const handleClick = () => {
    if (hasChildren) {
      setOpen((o) => !o);
    } else if (node.filter) {
      setCurrPage(1);
      const newQuery = { ...router.query, ...node.filter };
      router.push({ pathname: `/${shop_right ? "shop-right-sidebar" : "shop"}`, query: newQuery });
      dispatch(handleFilterSidebarClose());
    }
  };

  const paddingLeft = depth * 12 + 4;

  return (
    <div>
      <div
        onClick={handleClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: `${paddingLeft}px`,
          paddingTop: isSection ? "10px" : "5px",
          paddingBottom: isSection ? "4px" : "4px",
          cursor: hasChildren || node.filter ? "pointer" : "default",
          color: isSection
            ? "#555"
            : isActive
            ? "#821f40"
            : "#374151",
          fontWeight: isSection ? 700 : isActive ? 600 : 400,
          fontSize: isSection ? "11px" : depth === 1 ? "13px" : "12px",
          textTransform: isSection ? "uppercase" : "none",
          letterSpacing: isSection ? "0.8px" : "normal",
          borderLeft: isActive ? "2px solid #821f40" : "2px solid transparent",
          transition: "all 0.15s",
          userSelect: "none",
        }}
      >
        <span>{node.label}</span>
        {hasChildren && (
          <span style={{ fontSize: "10px", marginRight: "4px", color: "#999" }}>
            {open ? "▾" : "▸"}
          </span>
        )}
      </div>
      {hasChildren && open && (
        <div style={{ borderLeft: depth === 0 ? "none" : "1px solid #e5e7eb", marginLeft: `${paddingLeft + 8}px` }}>
          {node.children.map((child, i) => (
            <TreeNode
              key={i}
              node={child}
              depth={depth + 1}
              router={router}
              setCurrPage={setCurrPage}
              dispatch={dispatch}
              shop_right={shop_right}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const InventoryFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div className="tp-shop-widget mb-50">
      <h3
        className="tp-shop-widget-title"
        style={{
          fontSize: "11px",
          color: "#888",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "8px",
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: "8px",
        }}
      >
        Categorization of Inventory
      </h3>
      <div style={{ maxHeight: "600px", overflowY: "auto" }}>
        {INVENTORY_TREE.map((node, i) => (
          <TreeNode
            key={i}
            node={node}
            depth={0}
            router={router}
            setCurrPage={setCurrPage}
            dispatch={dispatch}
            shop_right={shop_right}
          />
        ))}
      </div>
    </div>
  );
};

export default InventoryFilter;
