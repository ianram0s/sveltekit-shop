import { AuthService } from "@/server/services/authService";

export async function load({ request }) {
	const user = await AuthService.getAuthenticatedUser(request);

	return {
		user
	};
} 