import { db } from '../db';
import { category, product, productCategory, productAttributes } from '../db/models';
import { eq, like, inArray } from 'drizzle-orm';
import type { Product, ProductWithCategories, Color } from '$lib/types/product';
import type { Category } from '$lib/server/db/models';

export class ProductService {
	/**
	 * Get all categories
	 */
	static async getCategories(): Promise<Category[]> {
		return await db.select().from(category);
	}

	/**
	 * Get category by ID
	 */
	static async getCategoryById(id: string): Promise<Category | undefined> {
		const result = await db.select().from(category).where(eq(category.id, id)).limit(1);
		return result[0];
	}

	/**
	 * Get category by slug
	 */
	static async getCategoryBySlug(slug: string): Promise<Category | undefined> {
		const result = await db.select().from(category).where(eq(category.slug, slug)).limit(1);
		return result[0];
	}

	/**
	 * Get all products with their attributes
	 */
	static async getProducts(): Promise<Product[]> {
		const dbProducts = await db.select().from(product);
		return await this.extendProductsWithAttributes(dbProducts);
	}

	/**
	 * Get product by ID with attributes
	 */
	static async getProductById(id: string): Promise<Product | undefined> {
		const result = await db.select().from(product).where(eq(product.id, id)).limit(1);
		const dbProduct = result[0];
		if (!dbProduct) return undefined;

		const products = await this.extendProductsWithAttributes([dbProduct]);
		return products[0];
	}

	/**
	 * Get product by slug with attributes
	 */
	static async getProductBySlug(slug: string): Promise<Product | undefined> {
		const result = await db.select().from(product).where(eq(product.slug, slug)).limit(1);
		const dbProduct = result[0];
		if (!dbProduct) return undefined;

		const products = await this.extendProductsWithAttributes([dbProduct]);
		return products[0];
	}

	/**
	 * Get products by category ID with attributes
	 */
	static async getProductsByCategory(categoryId: string): Promise<Product[]> {
		const productCategories = await db
			.select({ productId: productCategory.productId })
			.from(productCategory)
			.where(eq(productCategory.categoryId, categoryId));

		const productIds = productCategories.map(pc => pc.productId);

		if (productIds.length === 0) return [];

		const dbProducts = await db.select().from(product).where(inArray(product.id, productIds));
		return await this.extendProductsWithAttributes(dbProducts);
	}

	/**
	 * Get products by category slug with attributes
	 */
	static async getProductsByCategorySlug(categorySlug: string): Promise<Product[]> {
		const category = await this.getCategoryBySlug(categorySlug);
		if (!category) return [];
		return await this.getProductsByCategory(category.id);
	}

	/**
	 * Search products by query with attributes
	 */
	static async searchProducts(query: string): Promise<Product[]> {
		const searchTerm = `%${query}%`;
		const dbProducts = await db
			.select()
			.from(product)
			.where(like(product.title, searchTerm));
		return await this.extendProductsWithAttributes(dbProducts);
	}

	/**
	 * Get products with their category information
	 */
	static async getProductsWithCategories(): Promise<ProductWithCategories[]> {
		const products = await this.getProducts();
		const categories = await this.getCategories();

		return products.map(product => ({
			...product,
			categories: categories.filter(category =>
				product.categoryIds.includes(category.id)
			)
		}));
	}

	/**
	 * Get product with category information
	 */
	static async getProductWithCategories(productId: string): Promise<ProductWithCategories | undefined> {
		const product = await this.getProductById(productId);
		if (!product) return undefined;

		const categories = await this.getCategories();
		return {
			...product,
			categories: categories.filter(category =>
				product.categoryIds.includes(category.id)
			)
		};
	}

	/**
	 * Get product with category information by slug
	 */
	static async getProductWithCategoriesBySlug(slug: string): Promise<ProductWithCategories | undefined> {
		const product = await this.getProductBySlug(slug);
		if (!product) return undefined;

		const categories = await this.getCategories();
		return {
			...product,
			categories: categories.filter(category =>
				product.categoryIds.includes(category.id)
			)
		};
	}

	/**
	 * Get featured products (products in New Arrivals category)
	 */
	static async getFeaturedProducts(): Promise<Product[]> {
		const newArrivalsCategory = await this.getCategoryBySlug('new-arrivals');
		if (!newArrivalsCategory) return [];

		return await this.getProductsByCategory(newArrivalsCategory.id);
	}

	/**
	 * Get products with discount (has originalPrice)
	 */
	static async getDiscountedProducts(): Promise<Product[]> {
		const products = await this.getProducts();
		return products.filter(product => product.originalPrice);
	}

	/**
	 * Get products by price range
	 */
	static async getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
		const products = await this.getProducts();
		return products.filter(product =>
			Number(product.currentPrice) >= minPrice && Number(product.currentPrice) <= maxPrice
		);
	}

	/**
	 * Get products in stock
	 */
	static async getInStockProducts(): Promise<Product[]> {
		const products = await this.getProducts();
		return products.filter(product => product.inStock);
	}

	/**
	 * Get products by color name
	 */
	static async getProductsByColor(colorName: string): Promise<Product[]> {
		const products = await this.getProducts();
		return products.filter(product =>
			product.availableColors.some(color => color.name === colorName)
		);
	}

	/**
	 * Get all unique colors across all products
	 */
	static async getAllUniqueColors(): Promise<Color[]> {
		const products = await this.getProducts();
		const colorMap = new Map<string, Color>();

		products.forEach(product => {
			product.availableColors.forEach(color => {
				if (!colorMap.has(color.name)) {
					colorMap.set(color.name, color);
				}
			});
		});

		return Array.from(colorMap.values());
	}

	/**
	 * Get unique colors for a specific category
	 */
	static async getUniqueColorsByCategory(categorySlug: string): Promise<Color[]> {
		const products = await this.getProductsByCategorySlug(categorySlug);
		const colorMap = new Map<string, Color>();

		products.forEach(product => {
			product.availableColors.forEach(color => {
				if (!colorMap.has(color.name)) {
					colorMap.set(color.name, color);
				}
			});
		});

		return Array.from(colorMap.values());
	}

	/**
	 * Get products filtered by multiple criteria
	 */
	static async getFilteredProducts(filters: {
		category?: string;
		minPrice?: number;
		maxPrice?: number;
		colors?: string[];
		sizes?: string[];
		inStock?: boolean;
		onSale?: boolean;
	}): Promise<Product[]> {
		let products = await this.getProducts();

		if (filters.category) {
			products = products.filter(product =>
				product.categoryIds.includes(filters.category!)
			);
		}

		if (filters.minPrice !== undefined) {
			products = products.filter(product =>
				Number(product.currentPrice) >= filters.minPrice!
			);
		}

		if (filters.maxPrice !== undefined) {
			products = products.filter(product =>
				Number(product.currentPrice) <= filters.maxPrice!
			);
		}

		if (filters.colors && filters.colors.length > 0) {
			products = products.filter(product =>
				product.availableColors.some(color =>
					filters.colors!.includes(color.name)
				)
			);
		}

		if (filters.sizes && filters.sizes.length > 0) {
			products = products.filter(product =>
				product.availableSizes.some(size =>
					filters.sizes!.includes(size)
				)
			);
		}

		if (filters.inStock !== undefined) {
			products = products.filter(product =>
				product.inStock === filters.inStock
			);
		}

		if (filters.onSale) {
			products = products.filter(product =>
				product.originalPrice !== undefined
			);
		}

		return products;
	}

	/**
	 * Helper method to extend database products with their attributes
	 */
	private static async extendProductsWithAttributes(dbProducts: any[]): Promise<Product[]> {
		const extendedProducts: Product[] = [];

		for (const dbProduct of dbProducts) {
			const attributes = await db
				.select()
				.from(productAttributes)
				.where(eq(productAttributes.productId, dbProduct.id));

			const colorsAttr = attributes.find(attr => attr.attributeKey === 'availableColors');
			const sizesAttr = attributes.find(attr => attr.attributeKey === 'availableSizes');

			const productCategories = await db
				.select({ categoryId: productCategory.categoryId })
				.from(productCategory)
				.where(eq(productCategory.productId, dbProduct.id));

			const categoryIds = productCategories.map(pc => pc.categoryId);

			const extendedProduct: Product = {
				...dbProduct,
				availableColors: colorsAttr ? (colorsAttr.attributeValue as Color[]) : [],
				availableSizes: sizesAttr ? (sizesAttr.attributeValue as string[]) : [],
				categoryIds: categoryIds
			};

			extendedProducts.push(extendedProduct);
		}

		return extendedProducts;
	}
} 