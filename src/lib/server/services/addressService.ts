import type { Address, AddressFormInput } from '$lib/types';
import { db } from '../db';
import { address } from '../db/models';
import { eq, and } from 'drizzle-orm';
import { addressFormSchema } from '$lib/schemas';

export class AddressService {
	/**
	 * Get user addresses
	 */
	static async getUserAddresses(userId: string): Promise<Address[]> {
		try {
			return await db.query.address.findMany({
				where: eq(address.userId, userId),
				orderBy: (address, { desc }) => [desc(address.isDefault), desc(address.createdAt)]
			});
		} catch (error) {
			console.error('Error getting user addresses:', error);
			return [];
		}
	}

	/**
	 * Get address by ID
	 */
	static async getAddressById(id: string): Promise<Address | undefined> {
		try {
			const result = await db.query.address.findFirst({
				where: eq(address.id, id)
			});
			return result || undefined;
		} catch (error) {
			console.error('Error getting address by ID:', error);
			return undefined;
		}
	}

	/**
	 * Create new address
	 */
	static async createAddress(data: AddressFormInput & { userId: string }): Promise<{ address?: Address; errors?: string[] }> {
		const parse = addressFormSchema.safeParse(data);
		if (!parse.success) {
			return { errors: parse.error.issues.map((e: typeof parse.error.issues[number]) => e.message) };
		}

		try {
			return await db.transaction(async (tx) => {
				const newAddress: Address = {
					id: crypto.randomUUID(),
					userId: data.userId,
					street: data.street,
					city: data.city,
					state: data.state,
					zipCode: data.zipCode,
					country: data.country,
					label: data.label || null,
					isDefault: data.isDefault || false,
					createdAt: new Date(),
					updatedAt: new Date()
				};

				if (newAddress.isDefault) {
					await tx.update(address)
						.set({ isDefault: false, updatedAt: new Date() })
						.where(eq(address.userId, data.userId));
				}

				const [insertedAddress] = await tx.insert(address)
					.values(newAddress)
					.returning();

				return { address: insertedAddress };
			});
		} catch (error) {
			console.error('Error creating address:', error);
			return { errors: ['Internal server error'] };
		}
	}

	/**
	 * Update address
	 */
	static async updateAddress(id: string, data: AddressFormInput): Promise<{ address?: Address; errors?: string[] }> {
		const parse = addressFormSchema.safeParse(data);
		if (!parse.success) {
			return { errors: parse.error.issues.map((e: typeof parse.error.issues[number]) => e.message) };
		}

		try {
			return await db.transaction(async (tx) => {
				const currentAddress = await tx.query.address.findFirst({
					where: eq(address.id, id)
				});

				if (!currentAddress) {
					return { errors: ['Address not found'] };
				}

				if (data.isDefault) {
					await tx.update(address)
						.set({ isDefault: false, updatedAt: new Date() })
						.where(and(
							eq(address.userId, currentAddress.userId),
							eq(address.isDefault, true)
						));
				}

				const [updatedAddress] = await tx.update(address)
					.set({
						street: data.street,
						city: data.city,
						state: data.state,
						zipCode: data.zipCode,
						country: data.country,
						label: data.label,
						isDefault: data.isDefault,
						updatedAt: new Date()
					})
					.where(eq(address.id, id))
					.returning();

				if (!updatedAddress) {
					return { errors: ['Failed to update address'] };
				}

				return { address: updatedAddress };
			});
		} catch (error) {
			console.error('Error updating address:', error);
			return { errors: ['Internal server error'] };
		}
	}

	/**
	 * Delete address
	 */
	static async deleteAddress(id: string): Promise<boolean> {
		try {
			return await db.transaction(async (tx) => {
				const addressToDelete = await tx.query.address.findFirst({
					where: eq(address.id, id)
				});

				if (!addressToDelete) {
					return false;
				}

				await tx.delete(address).where(eq(address.id, id));

				if (addressToDelete.isDefault) {
					const remainingAddresses = await tx.query.address.findMany({
						where: eq(address.userId, addressToDelete.userId),
						orderBy: (address, { desc }) => [desc(address.createdAt)],
						limit: 1
					});

					if (remainingAddresses.length > 0) {
						await tx.update(address)
							.set({ isDefault: true, updatedAt: new Date() })
							.where(eq(address.id, remainingAddresses[0].id));
					}
				}

				return true;
			});
		} catch (error) {
			console.error('Error deleting address:', error);
			return false;
		}
	}

	/**
	 * Set default address for user
	 */
	static async setDefaultAddress(userId: string, addressId: string): Promise<boolean> {
		try {
			return await db.transaction(async (tx) => {
				const targetAddress = await tx.query.address.findFirst({
					where: and(eq(address.id, addressId), eq(address.userId, userId))
				});

				if (!targetAddress) {
					return false;
				}

				await tx.update(address)
					.set({ isDefault: false, updatedAt: new Date() })
					.where(eq(address.userId, userId));

				await tx.update(address)
					.set({ isDefault: true, updatedAt: new Date() })
					.where(eq(address.id, addressId));

				return true;
			});
		} catch (error) {
			console.error('Error setting default address:', error);
			return false;
		}
	}

	/**
	 * Get default address for user
	 */
	static async getDefaultAddress(userId: string): Promise<Address | undefined> {
		try {
			const result = await db.query.address.findFirst({
				where: and(eq(address.userId, userId), eq(address.isDefault, true))
			});
			return result || undefined;
		} catch (error) {
			console.error('Error getting default address:', error);
			return undefined;
		}
	}

	/**
	 * Validate address data
	 */
	static validateAddressData(data: AddressFormInput): { isValid: boolean; errors: string[] } {
		const parse = addressFormSchema.safeParse(data);
		return {
			isValid: parse.success,
			errors: parse.success ? [] : parse.error.issues.map((e: typeof parse.error.issues[number]) => e.message)
		};
	}
} 