import * as auth from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) {
			return redirect(302, '/signin');
		}
		
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);
		
		return redirect(302, '/');
	}
}; 