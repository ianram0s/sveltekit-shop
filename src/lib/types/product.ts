import type { Product as DbProduct, Category as DbCategory } from '$lib/server/db/models';

export interface Color {
	name: string;
	hex: string;
}

export interface ProductFilters {
	category?: string;
	minPrice?: number;
	maxPrice?: number;
	colors?: string[];
	sizes?: string[];
	inStock?: boolean;
	onSale?: boolean;
}

export interface ProductSortOptions {
	field: 'title' | 'price' | 'rating' | 'newest';
	direction: 'asc' | 'desc';
}

export interface Product extends DbProduct {
	availableColors: Color[];
	availableSizes: string[];
	categoryIds: string[];
}

export interface ProductWithCategories extends Product {
	categories: DbCategory[];
}

export { type Category as Category } from '@/server/db/models';

 