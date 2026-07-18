import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";

// Full inventory structure - heading based
const INVENTORY_SECTIONS = [
  {
    heading: "Based on Metal",
    groups: [
      {
        subheading: "Gold",
        items: [
          { label: "18K", filter: { metal: "18k" } },
          { label: "14K", filter: { metal: "14k" } },
          { label: "9K", filter: { metal: "9k" } },
        ],
      },
      {
        subheading: "Platinum",
        items: [
          { label: "PT950", filter: { metal: "pt950" } },
          { label: "PT900", filter: { metal: "pt900" } },
          { label: "PT850", filter: { metal: "pt850" } },
        ],
      },
      {
        subheading: "Titanium",
        items: [{ label: "Titanium", filter: { metal: "titanium" } }],
      },
    ],
  },
  {
    heading: "Diamonds",
    groups: [
      {
        subheading: "White Diamonds",
        items: [
          { label: "GIA Diamonds", filter: { category: "gia-diamonds" } },
          { label: "Rosecut Diamonds", filter: { category: "rosecut-diamonds" } },
          { label: "Illusion Cut Diamonds", filter: { category: "illusion-cut-diamonds" } },
          { label: "Fancy Cut Diamonds", filter: { category: "fancy-cut-diamonds" } },
        ],
      },
      {
        subheading: "Fancy Color Diamonds",
        items: [
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
    heading: "Precious Gemstones",
    groups: [
      {
        subheading: "Rubies",
        items: [
          { label: "Burma – No Heat", filter: { category: "burma-ruby-no-heat" } },
          { label: "Burma – Heat", filter: { category: "burma-ruby-heat" } },
          { label: "Mozambique – No Heat", filter: { category: "mozambique-ruby-no-heat" } },
          { label: "Mozambique – Heat", filter: { category: "mozambique-ruby-heat" } },
        ],
      },
      {
        subheading: "Emeralds",
        items: [
          { label: "Columbia", filter: { category: "columbia-emerald" } },
          { label: "Zambia", filter: { category: "zambia-emerald" } },
        ],
      },
      {
        subheading: "Sapphires",
        items: [
          { label: "Kashmir", filter: { category: "kashmir-sapphire" } },
          { label: "Burma", filter: { category: "burma-sapphire" } },
          { label: "Sri Lanka – No Heat", filter: { category: "srilanka-sapphire-no-heat" } },
          { label: "Sri Lanka – Heat", filter: { category: "srilanka-sapphire-heat" } },
          { label: "Madagascar – No Heat", filter: { category: "madagascar-sapphire-no-heat" } },
          { label: "Madagascar – Heat", filter: { category: "madagascar-sapphire-heat" } },
        ],
      },
    ],
  },
  {
    heading: "Semi-Precious Stones",
    groups: [
      {
        subheading: null,
        items: [
          { label: "Aquamarines", filter: { category: "aquamarines" } },
          { label: "Amethysts", filter: { category: "amethysts" } },
          { label: "Citrine", filter: { category: "citrine" } },
          { label: "Topaz", filter: { category: "topaz" } },
          { label: "Fluorite", filter: { category: "fluorite" } },
          { label: "Pietersite", filter: { category: "pietersite" } },
          { label: "Quartz – Lemon", filter: { category: "lemon-quartz" } },
          { label: "Quartz – Rose", filter: { category: "rose-quartz" } },
          { label: "Afghan Tourmalines", filter: { category: "afghan-tourmalines" } },
          { label: "Paraiba Tourmalines", filter: { category: "paraiba-tourmalines" } },
          { label: "Turquoises", filter: { category: "turquoises" } },
          { label: "Kunzite", filter: { category: "kunzite" } },
          { label: "Morganite", filter: { category: "morganite" } },
          { label: "Spinels – Burma", filter: { category: "burma-spinels" } },
          { label: "Spinels – Vietnam", filter: { category: "vietnam-spinels" } },
          { label: "Spinels – Tanzania", filter: { category: "tanzania-spinels" } },
          { label: "Opals – Australian", filter: { category: "australian-opals" } },
          { label: "Opals – Ethiopian", filter: { category: "ethiopian-opals" } },
          { label: "Moonstones – Indian", filter: { category: "indian-moonstones" } },
          { label: "Moonstones – African", filter: { category: "african-moonstones" } },
          { label: "Garnet – Rhodolite", filter: { category: "rhodolite-garnet" } },
          { label: "Garnet – Spessartite (Fanta)", filter: { category: "spessartite-garnet" } },
          { label: "Garnet – Tsavorite", filter: { category: "tsavorite-garnet" } },
        ],
      },
    ],
  },
  {
    heading: "Fine Jewellery",
    groups: [
      {
        subheading: null,
        items: [
          { label: "Diamond Jewellery", filter: { category: "diamond-jewellery" } },
          { label: "Gold Jewellery", filter: { category: "gold-jewellery" } },
          { label: "Gemstone Jewellery", filter: { category: "gemstone-jewellery" } },
        ],
      },
    ],
  },
  {
    heading: "High Jewellery",
    groups: [
      {
        subheading: "Rare Gemset Jewellery",
        items: [
          { label: "Bixbite (Red Emerald)", filter: { category: "bixbite-red-emerald" } },
          { label: "Paraiba – Brazil", filter: { category: "brazil-paraiba-tourmaline" } },
          { label: "Paraiba – Mozambique", filter: { category: "mozambique-paraiba-tourmaline" } },
        ],
      },
      {
        subheading: null,
        items: [
          { label: "Semi Precious Jewellery", filter: { category: "semi-precious-jewellery" } },
        ],
      },
    ],
  },
];

const InventoryFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleFilter = (filter) => {
    setCurrPage(1);
    const newQuery = { ...router.query, ...filter };
    router.push({ pathname: `/${shop_right ? "shop-right-sidebar" : "shop"}`, query: newQuery });
    dispatch(handleFilterSidebarClose());
  };

  const isActive = (filter) =>
    Object.entries(filter).every(([k, v]) => router.query[k] === v);

  return (
    <div className="tp-shop-widget mb-50">
      <h3
        className="tp-shop-widget-title"
        style={{
          fontSize: "11px",
          color: "#888",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "12px",
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: "8px",
        }}
      >
        Categorization of Inventory
      </h3>

      <div style={{ maxHeight: "620px", overflowY: "auto", paddingRight: "4px" }}>
        {INVENTORY_SECTIONS.map((section, si) => (
          <div key={si} style={{ marginBottom: "16px" }}>
            {/* Main Section Heading */}
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#444",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: "8px",
                paddingBottom: "4px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              {section.heading}
            </div>

            {section.groups.map((group, gi) => (
              <div key={gi} style={{ marginBottom: "8px" }}>
                {/* Sub-heading */}
                {group.subheading && (
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#555",
                      marginBottom: "4px",
                      paddingLeft: "4px",
                    }}
                  >
                    {group.subheading}
                  </div>
                )}

                {/* Items */}
                {group.items.map((item, ii) => {
                  const active = isActive(item.filter);
                  return (
                    <div
                      key={ii}
                      onClick={() => handleFilter(item.filter)}
                      style={{
                        paddingLeft: group.subheading ? "14px" : "4px",
                        paddingTop: "3px",
                        paddingBottom: "3px",
                        fontSize: "12px",
                        color: active ? "#821f40" : "#374151",
                        fontWeight: active ? 600 : 400,
                        cursor: "pointer",
                        borderLeft: active ? "2px solid #821f40" : "2px solid transparent",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) e.currentTarget.style.color = "#821f40";
                      }}
                      onMouseLeave={(e) => {
                        if (!active) e.currentTarget.style.color = "#374151";
                      }}
                    >
                      {item.label}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryFilter;
