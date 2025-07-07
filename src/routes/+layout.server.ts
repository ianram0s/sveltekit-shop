import auth from "$lib/server/auth";
import type { User } from "$lib/types";

export async function load({ request }) {
	const session = await auth.api.getSession({
		headers: request.headers
	});
	
	return {
		user: session?.user as User | null
	};
} 