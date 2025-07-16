import { fail } from "@sveltejs/kit";
import { UserService, AddressService, AuthService } from "@/server/services";
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { profileFormSchema, addressFormSchema } from '@/schemas';
import { parse } from 'date-fns';
import { formatDate } from '$lib/utils';

export async function load({ parent }) {
	const { user } = await parent();

	const [userData, userAddresses] = await Promise.all([
		UserService.getUserById(user.id),
		AddressService.getUserAddresses(user.id)
	]);

	const profileForm = await superValidate({
		name: userData?.name || '',
		email: userData?.email || '',
		phone: userData?.phone || '',
		dateOfBirth: formatDate(userData?.dateOfBirth)
	}, zod4(profileFormSchema));

	const addressForm = userAddresses[0]
		? await superValidate({
			street: userAddresses[0].street,
			city: userAddresses[0].city,
			state: userAddresses[0].state,
			zipCode: userAddresses[0].zipCode,
			country: userAddresses[0].country,
			isDefault: userAddresses[0].isDefault
		}, zod4(addressFormSchema))
		: await superValidate(zod4(addressFormSchema));

	return {
		user: userData,
		userAddresses,
		profileForm,
		addressForm
	};
}

export const actions = {
	updateProfile: async ({ request }) => {
		const user = await AuthService.getAuthenticatedUser(request);

		if (!user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const profileForm = await superValidate(request, zod4(profileFormSchema));

		if (!profileForm.valid) {
			return fail(400, { profileForm });
		}

		try {
			let dateOfBirth: string | undefined = undefined;
			if (profileForm.data.dateOfBirth) {
				const parsedDate = parse(profileForm.data.dateOfBirth, 'dd/MM/yyyy', new Date());

				if (isNaN(parsedDate.getTime())) {
					return fail(400, {
						profileForm,
						message: 'Invalid date format'
					});
				}
				dateOfBirth = profileForm.data.dateOfBirth;
			}
			const updatedUser = await UserService.updateUser(user.id, {
				name: profileForm.data.name,
				email: profileForm.data.email,
				phone: profileForm.data.phone || undefined,
				dateOfBirth: dateOfBirth || undefined
			});

			if (!updatedUser) {
				return fail(500, {
					profileForm,
					message: 'Failed to update user'
				});
			}

			return message(profileForm, 'Profile updated successfully!');
		} catch (error) {
			console.error('Error updating profile:', error);
			return fail(500, {
				profileForm,
				message: 'Internal Server Error'
			});
		}
	},

	updateAddress: async ({ request }) => {
		const user = await AuthService.getAuthenticatedUser(request);

		if (!user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const addressForm = await superValidate(request, zod4(addressFormSchema));

		if (!addressForm.valid) {
			return fail(400, { addressForm });
		}

		try {
			const addresses = await AddressService.getUserAddresses(user.id);
			const defaultAddress = addresses.find((addr: any) => addr.isDefault);

			if (defaultAddress) {
				const result = await AddressService.updateAddress(defaultAddress.id, {
					...addressForm.data,
					isDefault: true
				});
				if (result.errors) {
					return fail(400, { addressForm, message: result.errors.join(', ') });
				}
				if (!result.address) {
					return fail(500, { addressForm, message: 'Failed to update address' });
				}
			} else {
				const result = await AddressService.createAddress({
					...addressForm.data,
					userId: user.id,
					isDefault: true
				});
				if (result.errors) {
					return fail(400, { addressForm, message: result.errors.join(', ') });
				}
				if (!result.address) {
					return fail(500, { addressForm, message: 'Failed to create address' });
				}
			}

			return message(addressForm, 'Address updated successfully!');
		} catch (error) {
			console.error('Error updating address:', error);
			return fail(500, {
				addressForm,
				message: 'Internal Server Error'
			});
		}
	}
}; 