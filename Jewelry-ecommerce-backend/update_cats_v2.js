const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  { parent: 'Gold', children: ['18K', '14K', '9K'] },
  { parent: 'Platinum', children: ['PT950', 'PT900', 'PT850'] },
  { parent: 'Titanium', children: ['Titanium'] },
  { parent: 'White Diamonds', children: ['GIA Diamonds', 'Rosecut Diamonds', 'Illusion Cut Diamonds', 'Fancy Cut Diamonds'] },
  { parent: 'Fancy Color Diamonds', children: ['Yellow', 'Pink', 'Blue', 'Green', 'Orange', 'Brown'] },
  { parent: 'Rubies', children: ['Burma - No Heat', 'Burma - Heat', 'Mozambique - No Heat', 'Mozambique - Heat'] },
  { parent: 'Emeralds', children: ['Columbia', 'Zambia'] },
  { parent: 'Sapphires', children: ['Kashmir', 'Burma', 'SriLanka - No Heat', 'SriLanka - Heat', 'Madagascar - No Heat', 'Madagascar - Heat'] },
  { parent: 'Semi-Precious Stones', children: [
      'Aquamarines', 'Amethysts', 'Citrene', 'Topaz', 'Florite', 'Petersite', 
      'Lemon Quartz', 'Rose Quartz', 'Afgan Tourmalines', 'Pariaba Tourmalines', 
      'Turquoises', 'Kunzite', 'Morganite', 'Burma Spinels', 'Vietnam Spinels', 
      'Tanzania Spinels', 'Australian Opals', 'Ethopian Opals', 'Indian MoonStones', 
      'African MoonStones', 'Rodholite Garnet', 'Spesseratite Garnet', 'Tsavorite Garnet'
  ] },
  { parent: 'Fine Jewellery', children: ['Diamond Jewellery', 'Gold Jewellery', 'Gemstone Jewellery'] },
  { parent: 'High Jewellery', children: ['Rare Gemset Jewellery - Bixbite', 'Rare Gemset Jewellery - Pariaba Brazil', 'Rare Gemset Jewellery - Pariaba Mozambique', 'Semi Precious Jewellery'] }
];

async function seedCategories() {
  console.log('Seeding categories...');
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { parent: cat.parent },
      update: { children: cat.children },
      create: { parent: cat.parent, children: cat.children, productType: 'jewelry' }
    });
    console.log(`Upserted category: ${cat.parent}`);
  }
  console.log('Done!');
  process.exit(0);
}

seedCategories().catch(e => {
  console.error(e);
  process.exit(1);
});
