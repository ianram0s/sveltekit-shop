import { db } from './';
import { category, product, productCategory, productAttributes } from '../models';
import { eq } from 'drizzle-orm';
import type { SeederFunction } from './';
import { categories } from './data/categories';
import { products } from './data/products';

export const productSeeder: SeederFunction = {
    name: 'seed-products',
    run: async () => {
        console.log('🌱 Seeding categories...');

        for (const cat of categories) {
            const existingCategory = await db
                .select()
                .from(category)
                .where(eq(category.id, cat.id))
                .limit(1);

            if (existingCategory.length === 0) {
                await db.insert(category).values({
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    description: cat.description || null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                console.log(`✅ Created category: ${cat.name}`);
            } else {
                console.log(`⏭️  Category already exists: ${cat.name}`);
            }
        }

        console.log('\n🌱 Seeding products...');

        for (const prod of products) {
            const existingProduct = await db
                .select()
                .from(product)
                .where(eq(product.id, prod.id))
                .limit(1);

            if (existingProduct.length === 0) {
                await db.insert(product).values({
                    id: prod.id,
                    title: prod.title,
                    description: prod.description,
                    slug: prod.slug,
                    currentPrice: prod.currentPrice.toString(),
                    originalPrice: prod.originalPrice ? prod.originalPrice.toString() : null,
                    images: prod.images,
                    inStock: prod.inStock,
                    rating: prod.rating ? prod.rating.toString() : null,
                    reviewCount: prod.reviewCount || 0,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                console.log(`✅ Created product: ${prod.title}`);
            } else {
                console.log(`⏭️  Product already exists: ${prod.title}`);
            }
        }

        console.log('\n🌱 Seeding product-category relationships...');

        for (const prod of products) {
            for (const categoryId of prod.categoryIds) {
                // Check if relationship already exists
                const existingRelationships = await db
                    .select()
                    .from(productCategory);

                const relationshipExists = existingRelationships.some(
                    rel => rel.productId === prod.id && rel.categoryId === categoryId
                );

                if (!relationshipExists) {
                    await db.insert(productCategory).values({
                        id: crypto.randomUUID(),
                        productId: prod.id,
                        categoryId: categoryId,
                        createdAt: new Date()
                    });
                    console.log(`✅ Linked product '${prod.title}' to category '${categoryId}'`);
                } else {
                    console.log(`⏭️  Product-category relationship already exists: ${prod.title} -> ${categoryId}`);
                }
            }
        }

        console.log('\n🌱 Seeding product attributes...');

        for (const prod of products) {
            const existingAttributes = await db
                .select()
                .from(productAttributes)
                .where(eq(productAttributes.productId, prod.id));

            const hasColors = existingAttributes.some(attr => attr.attributeKey === 'availableColors');
            const hasSizes = existingAttributes.some(attr => attr.attributeKey === 'availableSizes');

            if (!hasColors) {
                await db.insert(productAttributes).values({
                    id: crypto.randomUUID(),
                    productId: prod.id,
                    attributeKey: 'availableColors',
                    attributeValue: prod.availableColors,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                console.log(`✅ Added colors for product: ${prod.title}`);
            } else {
                console.log(`⏭️  Colors already exist for product: ${prod.title}`);
            }

            if (!hasSizes) {
                await db.insert(productAttributes).values({
                    id: crypto.randomUUID(),
                    productId: prod.id,
                    attributeKey: 'availableSizes',
                    attributeValue: prod.availableSizes,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                console.log(`✅ Added sizes for product: ${prod.title}`);
            } else {
                console.log(`⏭️  Sizes already exist for product: ${prod.title}`);
            }
        }

        console.log('\n🎉 Product seeding completed successfully!');
    }
}; 