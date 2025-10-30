import { ProductService } from '$lib/server/services/productService';

export async function load() {
    const newArrivalsProducts = await ProductService.getProductsByCategorySlug('new-arrivals');
    const topSellingProducts = await ProductService.getProductsByCategorySlug('top-selling');

    return {
        newArrivalsProducts,
        topSellingProducts,
    };
}
