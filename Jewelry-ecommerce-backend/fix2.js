const prisma = require('./prisma/client');

async function fixUncategorizedGemstones() {
    try {
        // Products imported from gemstone CSV have: no metalId, no metalGms, no grossGms
        // and their categoryName is usually the stone type (Sapphire, Ruby) or 'Uncategorized'
        // We can identify them by checking additionalInformation - gemstones have no Metal/Metal gms values

        const products = await prisma.product.findMany({
            where: { productType: 'jewelry', categoryName: 'Uncategorized' }
        });

        console.log("Uncategorized jewelry products:", products.length);

        // Check additionalInformation - if no Metal field, it's likely a gemstone
        const gemstoneIds = products
            .filter(p => {
                const info = Array.isArray(p.additionalInformation) ? p.additionalInformation : [];
                const hasMetal = info.some(i => i.key === 'Metal' && i.value && i.value.length > 0);
                return !hasMetal;
            })
            .map(p => p.id);

        console.log("Gemstones identified (no metal):", gemstoneIds.length);

        if (gemstoneIds.length > 0) {
            const res = await prisma.product.updateMany({
                where: { id: { in: gemstoneIds } },
                data: { productType: 'gemstone' }
            });
            console.log("Fixed to gemstone:", res.count);
        }

        // Verify
        const counts = await prisma.product.groupBy({ by: ['productType'], _count: true });
        console.log("Final counts:", JSON.stringify(counts));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

fixUncategorizedGemstones();
