const menu_data = [
  {
    id: 1,
    sub_menu: true,
    title: 'Diamonds',
    link: '/shop?category=diamonds',
    sub_menus: [
      { title: 'GIA Certified Diamonds', link: '/shop?category=diamonds&subCategory=gia-certified-diamonds' },
      { title: 'Rosecut Diamonds', link: '/shop?category=diamonds&subCategory=rosecut-diamonds' },
      { title: 'Side Stones', link: '/shop?category=diamonds&subCategory=side-stones' },
      { title: 'Pie Cut Diamonds', link: '/shop?category=diamonds&subCategory=pie-cut-diamonds' },
      { title: 'Custom Make Shapes & Sizes', link: '/shop?category=diamonds&subCategory=custom-make-shapes-sizes' },
    ]
  },
  {
    id: 2,
    sub_menu: true,
    title: 'Precious Gemstones',
    link: '/shop?category=precious-gemstones',
    sub_menus: [
      { title: 'Rubies', link: '/shop?category=precious-gemstones&subCategory=rubies' },
      { title: 'Emeralds', link: '/shop?category=precious-gemstones&subCategory=emeralds' },
      { title: 'Sapphires', link: '/shop?category=precious-gemstones&subCategory=sapphires' },
    ]
  },
  {
    id: 3,
    sub_menu: true,
    title: 'Rare (Collector’s)Gemstones',
    link: '/shop?category=rare-collectorsgemstones',
    sub_menus: [
      { title: 'Bixbites (Red Beryl)', link: '/shop?category=rare-collectorsgemstones&subCategory=bixbites-red-beryl' },
      { title: 'Grandidierites', link: '/shop?category=rare-collectorsgemstones&subCategory=grandidierites' },
      { title: 'Benitoite', link: '/shop?category=rare-collectorsgemstones&subCategory=benitoite' },
      { title: 'Alexandrites', link: '/shop?category=rare-collectorsgemstones&subCategory=alexandrites' },
      { title: 'Tanzanites', link: '/shop?category=rare-collectorsgemstones&subCategory=tanzanites-rare-collectorsgemstones' },
      { title: 'Others', link: '/shop?category=rare-collectorsgemstones&subCategory=others' },
    ]
  },
  {
    id: 4,
    sub_menu: true,
    title: 'Semi-Precious Gemstones',
    link: '/shop?category=semi-precious-gemstones',
    sub_menus: [
      { title: 'Tourmalines', link: '/shop?category=semi-precious-gemstones&subCategory=tourmalines' },
      { title: 'Tanzanites', link: '/shop?category=semi-precious-gemstones&subCategory=tanzanites' },
      { title: 'Aquamarines', link: '/shop?category=semi-precious-gemstones&subCategory=aquamarines' },
      { title: 'Garnets', link: '/shop?category=semi-precious-gemstones&subCategory=garnets' },
      { title: 'Rodolites', link: '/shop?category=semi-precious-gemstones&subCategory=rodolites' },
    ]
  },
  {
    id: 5,
    sub_menu: true,
    title: 'Fine Jewellery',
    link: '/shop?category=fine-jewellery',
    sub_menus: [
      { title: 'Rings', link: '/shop?category=fine-jewellery&subCategory=rings' },
      { title: 'Earrings', link: '/shop?category=fine-jewellery&subCategory=earrings' },
      { title: 'Pendants', link: '/shop?category=fine-jewellery&subCategory=pendants' },
      { title: 'Bracelets', link: '/shop?category=fine-jewellery&subCategory=bracelets' },
      { title: 'Necklaces', link: '/shop?category=fine-jewellery&subCategory=necklaces' },
      { title: 'Brooches', link: '/shop?category=fine-jewellery&subCategory=brooches' },
      { title: 'Cufflinks', link: '/shop?category=fine-jewellery&subCategory=cufflinks' },
    ]
  },
  {
    id: 6,
    sub_menu: true,
    title: 'About Us',
    link: '/about-us/',
    sub_menus: [
      { title: 'Our Story', link: '/our-story' },
      { title: 'Our Values', link: '/our-values' },
      { title: 'Our Team', link: '/our-team' },
    ]
  },
  {
    id: 7,
    adminOnly: true,
    title: 'Admin',
    link: '#'
  }
]

export default menu_data;

// mobile_menu
export const mobile_menu = [
  ...menu_data
]
