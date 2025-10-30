import { AuthService } from '@/server/services';
import { ProductService } from '@/server/services/productService';

export async function load({ request }) {
    const user = await AuthService.getAuthenticatedUser(request);
    const categories = await ProductService.getCategories();

    return {
        user,
        categories,
    };
}
