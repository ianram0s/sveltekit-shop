import { db } from './';
import { user } from '../models';
import { eq } from 'drizzle-orm';
import type { SeederFunction } from './';

export const adminSeeder: SeederFunction = {
    name: 'create-admins',
    run: async () => {
        const adminEmails = ['ianramosz22@gmail.com'];

        console.log(`Setting ${adminEmails.length} users as owners/admins...`);

        for (const email of adminEmails) {
            const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1);

            if (existingUser.length > 0) {
                await db
                    .update(user)
                    .set({
                        role: 'owner',
                        updatedAt: new Date(),
                    })
                    .where(eq(user.email, email));

                console.log(`👑 Updated user '${email}' to owner role`);
            } else {
                console.log(`⚠️  User '${email}' not found - skipping`);
            }
        }
    },
};
