import auth from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

async function getAuthenticatedUser(request: Request) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session?.user) {
        return null;
    }

    return session.user;
}

export async function load({ request }) {
    const user = await getAuthenticatedUser(request);

    if (!user) {
        throw redirect(302, '/signin');
    }

    return {
        user,
    };
}
