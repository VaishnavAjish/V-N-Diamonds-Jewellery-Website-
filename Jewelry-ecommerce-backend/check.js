const prisma = require('./prisma/client');
async function check() {
    try {
        const types = await prisma.product.findMany({ select: { productType: true }, distinct: ['productType'] });
        console.log(JSON.stringify(types));
        const counts = await prisma.product.groupBy({ by: ['productType'], _count: true });
        console.log(JSON.stringify(counts));
    } finally {
        await prisma.$disconnect();
    }
}
check();
