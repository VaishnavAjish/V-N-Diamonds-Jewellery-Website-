const prisma = require('./prisma/client');

async function fix() {
    try {
        console.log("Fixing loose diamonds...");
        const resDiamond = await prisma.product.updateMany({
            where: { categoryName: 'Diamond', productType: 'jewelry' },
            data: { productType: 'diamond' }
        });
        console.log("Diamonds fixed:", resDiamond.count);

        console.log("Fetching distinct categories for non-diamonds...");
        const categories = await prisma.product.findMany({
            where: { categoryName: { not: 'Diamond' } },
            select: { categoryName: true, productType: true },
            distinct: ['categoryName']
        });
        console.log("Categories found:", categories);

        const gemstoneCats = categories
            .map(c => c.categoryName)
            .filter(c => !['Ring', 'Necklace', 'Earrings', 'Bracelet', 'Pendant', 'Bangle'].includes(c));

        if (gemstoneCats.length > 0) {
            console.log("Fixing gemstones in categories:", gemstoneCats);
            const resGem = await prisma.product.updateMany({
                where: { categoryName: { in: gemstoneCats }, productType: 'jewelry' },
                data: { productType: 'gemstone' }
            });
            console.log("Gemstones fixed:", resGem.count);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

fix();
