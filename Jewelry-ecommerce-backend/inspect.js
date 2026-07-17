const prisma = require('./prisma/client');

async function findProduct() {
    try {
        const p = await prisma.product.findFirst({
            where: { sku: 'VNPCEM928' }
        });
        console.log(JSON.stringify(p, null, 2));
    } finally {
        await prisma.$disconnect();
    }
}
findProduct();
