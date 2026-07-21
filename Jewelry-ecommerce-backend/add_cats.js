require('dotenv').config();
const fs = require('fs');
const prisma = require('./prisma/client');
const crypto = require('crypto');

console.log("Starting script...");

function generateObjectId() {
  return crypto.randomBytes(12).toString('hex');
}

const newCategories = [
  {
    _id: generateObjectId(),
    parent: "Gold",
    children: ["18K", "14K", "9K"],
    productType: "jewelry",
    status: "Show"
  },
  {
    _id: generateObjectId(),
    parent: "Platinum",
    children: ["PT950", "PT900", "PT850"],
    productType: "jewelry",
    status: "Show"
  },
  {
    _id: generateObjectId(),
    parent: "Titanium",
    children: ["Titanium"],
    productType: "jewelry",
    status: "Show"
  },
  {
    _id: generateObjectId(),
    parent: "White Diamonds",
    children: ["GIA Diamonds", "Rosecut Diamonds", "Illusion Cut Diamonds", "Fancy Diamonds"],
    productType: "jewelry",
    status: "Show"
  }
];

async function run() {
  // Update categories.json
  const categoriesJsonPath = './utils/categories.json';
  const categoriesJsPath = './utils/categories.js';

  const cats = JSON.parse(fs.readFileSync(categoriesJsonPath, 'utf8'));
  
  // check if they already exist to avoid duplication
  let updated = false;
  for (const newCat of newCategories) {
    if (!cats.find(c => c.parent === newCat.parent)) {
      cats.push(newCat);
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(categoriesJsonPath, JSON.stringify(cats, null, 2));
    let jsContent = `const categories = ${JSON.stringify(cats, null, 2)};\n\nmodule.exports = categories;`;
    fs.writeFileSync(categoriesJsPath, jsContent);
    console.log("Updated categories.json and categories.js");
  } else {
    console.log("Categories already exist in json/js");
  }

  // Insert into DB
  for (const newCat of newCategories) {
    const existing = await prisma.category.findUnique({
      where: { parent: newCat.parent }
    });
    if (!existing) {
      await prisma.category.create({
        data: {
          id: newCat._id,
          parent: newCat.parent,
          children: newCat.children,
          productType: newCat.productType,
          status: newCat.status
        }
      });
      console.log(`Inserted category ${newCat.parent}`);
    } else {
      console.log(`Category ${newCat.parent} already exists in DB. Updating...`);
      await prisma.category.update({
        where: { parent: newCat.parent },
        data: {
          children: newCat.children
        }
      });
    }
  }
}

run().then(() => {
  console.log('Done');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
