import { error } from '@sveltejs/kit';
import { ProductService } from '@/server/services/productService';

export async function load({ params, url }) {
    const { categoryName } = params;
    const category = await ProductService.getCategoryBySlug(categoryName);
    if (!category) throw error(404, 'Category not found');

    let products = await ProductService.getProductsByCategory(category.id);

    const colors = await ProductService.getUniqueColorsByCategory(categoryName);
    const sizes = Array.from(new Set(products.flatMap((p) => p.availableSizes)));

    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const colorFilters = url.searchParams.getAll('color');
    const sizeFilters = url.searchParams.getAll('size');

    if (minPrice || maxPrice || colorFilters.length || sizeFilters.length) {
        products = products.filter((product) => {
            const priceOk =
                (!minPrice || Number(product.currentPrice) >= +minPrice) &&
                (!maxPrice || Number(product.currentPrice) <= +maxPrice);
            const colorOk = !colorFilters.length || product.availableColors.some((c) => colorFilters.includes(c.name));
            const sizeOk = !sizeFilters.length || product.availableSizes.some((s) => sizeFilters.includes(s));

            return priceOk && colorOk && sizeOk;
        });
    }

    return {
        category,
        products,
        colors,
        sizes,
        minPrice: minPrice ? +minPrice : null,
        maxPrice: maxPrice ? +maxPrice : null,
        colorFilters,
        sizeFilters,
    };
}
