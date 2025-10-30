import { AuthService, handleAuthError } from '$lib/server/services';

export async function load({ request }) {
    try {
        const user = await AuthService.requireAdmin(request);

        return {
            user,
        };
    } catch (err) {
        handleAuthError(err);
    }
}
