<script lang="ts">
    import { superForm, type SuperValidated } from 'sveltekit-superforms';
    import { zod4Client } from 'sveltekit-superforms/adapters';
    import { addressFormSchema, type AddressFormInput } from '@/schemas';
    import { buttonVariants } from '$lib/components/ui/button';
    import { cn } from '$lib/utils';

    import { SaveIcon, XIcon, AlertCircleIcon } from '$lib/components/icons';

    let {
        formData,
        onCancel,
        onSuccess,
    }: {
        formData: SuperValidated<AddressFormInput>;
        onCancel: () => void;
        onSuccess?: ((message: string) => void) | undefined;
    } = $props();

    const { form, errors, enhance, submitting, message } = superForm(formData, {
        validators: zod4Client(addressFormSchema),
        resetForm: false,
        dataType: 'form',
        invalidateAll: true,
        onUpdated: ({ form }) => {
            if (form.message) {
                onSuccess?.(form.message);
            }
        },
    });

    const originalData = formData.data;

    const hasChanges = $derived(
        $form.street !== originalData.street ||
            $form.city !== originalData.city ||
            $form.state !== originalData.state ||
            $form.zipCode !== originalData.zipCode ||
            $form.country !== originalData.country,
    );
</script>

<form class="space-y-6" method="post" action="?/updateAddress" use:enhance>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="md:col-span-2">
            <label for="street" class="text-foreground mb-2 block text-sm font-medium"> Street Address </label>
            <input
                id="street"
                name="street"
                bind:value={$form.street}
                type="text"
                class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.street
                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                    : 'border-input'}"
                placeholder="Enter street address"
            />
            {#if $errors.street}
                <div class="mt-1 flex items-center space-x-1">
                    <AlertCircleIcon class="text-destructive h-4 w-4" />
                    <p class="text-destructive text-sm">{$errors.street}</p>
                </div>
            {/if}
        </div>

        <div>
            <label for="city" class="text-foreground mb-2 block text-sm font-medium"> City </label>
            <input
                id="city"
                name="city"
                bind:value={$form.city}
                type="text"
                class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.city
                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                    : 'border-input'}"
                placeholder="Enter city"
            />
            {#if $errors.city}
                <div class="mt-1 flex items-center space-x-1">
                    <AlertCircleIcon class="text-destructive h-4 w-4" />
                    <p class="text-destructive text-sm">{$errors.city}</p>
                </div>
            {/if}
        </div>

        <div>
            <label for="state" class="text-foreground mb-2 block text-sm font-medium"> State </label>
            <input
                id="state"
                name="state"
                bind:value={$form.state}
                type="text"
                class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.state
                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                    : 'border-input'}"
                placeholder="Enter state"
            />
            {#if $errors.state}
                <div class="mt-1 flex items-center space-x-1">
                    <AlertCircleIcon class="text-destructive h-4 w-4" />
                    <p class="text-destructive text-sm">{$errors.state}</p>
                </div>
            {/if}
        </div>

        <div>
            <label for="zipCode" class="text-foreground mb-2 block text-sm font-medium"> ZIP Code </label>
            <input
                id="zipCode"
                name="zipCode"
                bind:value={$form.zipCode}
                type="text"
                class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.zipCode
                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                    : 'border-input'}"
                placeholder="Enter ZIP code"
            />
            {#if $errors.zipCode}
                <div class="mt-1 flex items-center space-x-1">
                    <AlertCircleIcon class="text-destructive h-4 w-4" />
                    <p class="text-destructive text-sm">{$errors.zipCode}</p>
                </div>
            {/if}
        </div>

        <div>
            <label for="country" class="text-foreground mb-2 block text-sm font-medium"> Country </label>
            <input
                id="country"
                name="country"
                bind:value={$form.country}
                type="text"
                class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.country
                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                    : 'border-input'}"
                placeholder="Enter country"
            />
            {#if $errors.country}
                <div class="mt-1 flex items-center space-x-1">
                    <AlertCircleIcon class="text-destructive h-4 w-4" />
                    <p class="text-destructive text-sm">{$errors.country}</p>
                </div>
            {/if}
        </div>
    </div>

    <div class="flex items-center space-x-4">
        <button
            type="submit"
            disabled={$submitting || !hasChanges}
            class={cn(buttonVariants({ variant: 'default' }), 'cursor-pointer')}
        >
            {#if $submitting}
                <div
                    class="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2"
                ></div>
            {:else}
                <SaveIcon class="mr-2 h-4 w-4" />
            {/if}
            Save Address
        </button>
        <button type="button" class={cn(buttonVariants({ variant: 'outline' }), 'cursor-pointer')} onclick={onCancel}>
            <XIcon class="mr-2 h-4 w-4" />
            Cancel
        </button>
    </div>
</form>
