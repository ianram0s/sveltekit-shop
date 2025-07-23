import { error } from '@sveltejs/kit';
import { ProductService } from '$lib/server/services/productService';

export async function load({ params }) {
    const { slug } = params;

    if (!slug) {
        throw error(404, 'Product not found');
    }

    const product = await ProductService.getProductWithCategoriesBySlug(slug);

    if (!product) {
        throw error(404, 'Product not found');
    }

    return {
        product
    };
} 