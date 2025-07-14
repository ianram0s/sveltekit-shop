import { AuthService } from "@/server/services";

export async function load({ request }) {
	const user = await AuthService.getAuthenticatedUser(request);

	return {
		user
	};
} 