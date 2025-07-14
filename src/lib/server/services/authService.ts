import auth from "$lib/server/auth";
import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "$lib/types";
import { error, redirect } from "@sveltejs/kit";

export enum AuthError {
	REDIRECT_SIGNIN = 'REDIRECT_SIGNIN',
	ACCESS_DENIED = 'ACCESS_DENIED',
	USER_NOT_FOUND = 'USER_NOT_FOUND',
	INVALID_SESSION = 'INVALID_SESSION',
	INSUFFICIENT_PRIVILEGES = 'INSUFFICIENT_PRIVILEGES'
}

export class AuthException extends Error {
	constructor(public readonly authError: AuthError, message?: string) {
		super(message || authError);
		this.name = 'AuthException';
	}
}

export function handleAuthError(err: unknown): never {
	if (err instanceof AuthException) {
		switch (err.authError) {
			case AuthError.REDIRECT_SIGNIN:
				throw redirect(302, '/signin');
			case AuthError.ACCESS_DENIED:
				throw error(403, { message: 'Access denied. You do not have permission to access this resource.' });
			case AuthError.INSUFFICIENT_PRIVILEGES:
				throw error(403, { message: 'Insufficient privileges. You need higher permissions to access this resource.' });
			case AuthError.USER_NOT_FOUND:
				throw error(404, { message: 'User not found.' });
			case AuthError.INVALID_SESSION:
				throw redirect(302, '/signin');
			default:
				throw error(500, { message: 'Authentication error occurred.' });
		}
	}

	console.error('Unexpected error in auth handler:', err);
	throw error(500, { message: 'Internal server error' });
}

export class AuthService {
	/**
	 * Get authenticated user with role data from database
	 */
	static async getAuthenticatedUser(request: Request): Promise<User | null> {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user) {
			return null;
		}

		const dbUser = await db.query.user.findFirst({
			where: eq(user.id, session.user.id)
		});

		return dbUser || null;
	}

	/**
	 * Require authenticated user (throws if not authenticated)
	 */
	static async requireAuth(request: Request): Promise<User> {
		const user = await this.getAuthenticatedUser(request);

		if (!user) {
			throw new AuthException(AuthError.REDIRECT_SIGNIN, 'Authentication required');
		}

		return user;
	}

	/**
	 * Require admin or owner role (throws if insufficient privileges)
	 */
	static async requireAdmin(request: Request): Promise<User> {
		const user = await this.requireAuth(request);

		if (user.role !== 'admin' && user.role !== 'owner') {
			throw new AuthException(AuthError.ACCESS_DENIED, 'Admin privileges required');
		}

		return user;
	}

	/**
	 * Require owner role specifically (throws if not owner)
	 */
	static async requireOwner(request: Request): Promise<User> {
		const user = await this.requireAuth(request);

		if (user.role !== 'owner') {
			throw new AuthException(AuthError.INSUFFICIENT_PRIVILEGES, 'Owner privileges required');
		}

		return user;
	}
} 