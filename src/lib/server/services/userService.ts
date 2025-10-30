import { profileFormSchema, type ProfileFormInput } from '$lib/schemas';
import { db } from '../db';
import { user, type User } from '../db/models';
import { eq } from 'drizzle-orm';
import { parse as parseDate } from 'date-fns';

export class UserService {
    /**
     * Get user by ID
     */
    static async getUserById(id: string): Promise<User | undefined> {
        try {
            const result = await db.query.user.findFirst({
                where: eq(user.id, id),
            });
            return result || undefined;
        } catch (error) {
            console.error('Error getting user by ID:', error);
            return undefined;
        }
    }

    /**
     * Update user data
     */
    static async updateUser(id: string, data: ProfileFormInput): Promise<{ user?: User; errors?: string[] }> {
        const parse = profileFormSchema.safeParse(data);
        if (!parse.success) {
            return { errors: parse.error.issues.map((e: (typeof parse.error.issues)[number]) => e.message) };
        }

        try {
            const updateData: Partial<User> = Object.fromEntries(
                Object.entries({ ...data }).map(([key, value]) => {
                    if (key === 'dateOfBirth' && value && typeof value === 'string') {
                        const parsedDate = parseDate(value, 'dd/MM/yyyy', new Date());
                        const utcDate = new Date(
                            Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()),
                        );
                        if (isNaN(parsedDate.getTime())) {
                            return [key, null];
                        }
                        const yyyy = utcDate.getUTCFullYear();
                        const mm = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
                        const dd = String(utcDate.getUTCDate()).padStart(2, '0');
                        return [key, `${yyyy}-${mm}-${dd}`];
                    }
                    return [key, value === undefined ? null : value];
                }),
            );
            updateData.updatedAt = new Date();

            const [updatedUser] = await db.update(user).set(updateData).where(eq(user.id, id)).returning();

            if (!updatedUser) {
                return { errors: ['User not found'] };
            }

            return { user: updatedUser };
        } catch (error) {
            console.error('Error updating user:', error);
            return { errors: ['Internal server error'] };
        }
    }

    /**
     * Validate user data
     */
    static validateUserData(data: ProfileFormInput): { isValid: boolean; errors: string[] } {
        const parse = profileFormSchema.safeParse(data);
        return {
            isValid: parse.success,
            errors: parse.success ? [] : parse.error.issues.map((e: (typeof parse.error.issues)[number]) => e.message),
        };
    }
}
