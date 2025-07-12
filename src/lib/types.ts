export type { User, Address, CreateAddressData, Session } from '$lib/server/db/schema';

export interface UpdateUserData {
	name?: string;
	email?: string;
	phone?: string | null;
	dateOfBirth?: string | null;
}

export interface UpdateAddressData {
	street?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	country?: string;
	label?: string | null;
	isDefault?: boolean;
}
