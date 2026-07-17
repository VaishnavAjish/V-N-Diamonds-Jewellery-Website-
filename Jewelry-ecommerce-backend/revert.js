const prisma = require('./prisma/client');
async function revert() {
    try {
        const res = await prisma.product.updateMany({
            where: {
                categoryName: { in: ['Uncategorized', 'Pendent', 'Cufflinks', 'Belly Button', 'Brooch', 'Watches'] },
                productType: 'gemstone'
            },
            data: { productType: 'jewelry' }
        });
        console.log('Reverted non-gemstones:', res.count);
    } finally {
        await prisma.$disconnect();
    }
}
revert();
