import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { env } from '$env/dynamic/private';
 
const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
	emailAndPassword: {
		enabled: true,
	},
    socialProviders: {
        google: { 
            clientId: env.GOOGLE_CLIENT_ID, 
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            prompt: "select_account",
        }, 
    }
});

export default auth;