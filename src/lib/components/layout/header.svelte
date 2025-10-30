<script lang="ts">
    import { authClient } from '$lib/auth-client';
    import { goto } from '$app/navigation';

    import { CartIcon } from '$lib/components/cart-icon';
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
    } from '$lib/components/ui/dropdown-menu';
    import type { User } from '$lib/server/db/models';
    import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
    import { ShieldIcon, UserIcon } from '$lib/components/icons';
    import { ChevronDown, Menu } from '@lucide/svelte';

    let {
        user,
        noticeVisible,
        onToggleMobileSidebar,
    }: { user: User | null; noticeVisible: boolean; onToggleMobileSidebar: () => void } = $props();

    async function handleSignOut() {
        await authClient.signOut(
            {},
            {
                onSuccess: () => {
                    goto('/', { invalidateAll: true });
                },
            },
        );
    }
</script>

<header
    class="border-border transition-top fixed right-0 left-0 z-40 border-b bg-white/75 shadow-sm backdrop-blur-sm duration-200 dark:bg-black/75"
    style="top: {noticeVisible ? '36px' : '0'}"
>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
            <div class="flex items-center gap-3 md:gap-8">
                <button
                    class="text-foreground hover:text-muted-foreground inline-flex h-10 w-10 cursor-pointer items-center justify-center transition-colors md:hidden"
                    onclick={onToggleMobileSidebar}
                    aria-label="Open menu"
                >
                    <Menu class="h-7 w-7" />
                </button>

                <a href="/" class="text-foreground hover:text-muted-foreground font-integral mb-1 text-xl font-bold">
                    DEMO SHOP
                </a>

                <!-- Desktop Navigation -->
                <nav class="hidden items-center gap-6 md:flex">
                    <a
                        href="/new-arrivals"
                        class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-200"
                    >
                        New Arrivals
                    </a>

                    <!-- Tops Dropdown -->
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            class="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors duration-200"
                        >
                            Tops
                            <ChevronDown class="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <a href="/shirt" class="w-full">Shirt</a>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <a href="/t-shirt" class="w-full">T-Shirt</a>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <!-- Bottoms -->
                    <a
                        href="/bottoms"
                        class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-200"
                    >
                        Bottoms
                    </a>
                </nav>
            </div>

            <!-- User Section -->
            <div class="flex items-center justify-center space-x-2">
                <!-- Cart Icon -->
                <div class="inline-flex cursor-pointer">
                    <a
                        href="/cart"
                        class="text-foreground hover:text-muted-foreground inline-flex h-10 w-10 items-center justify-center transition-colors"
                    >
                        <CartIcon size="28" />
                    </a>
                </div>

                {#if user}
                    <!-- User Dropdown Menu -->
                    <DropdownMenu>
                        <DropdownMenuTrigger class="inline-flex h-10 w-10 items-center justify-center">
                            <Avatar class="h-8 w-8 cursor-pointer">
                                {#if user.image}
                                    <AvatarImage src={user.image} alt={user.name || user.email} />
                                {/if}
                                <AvatarFallback class="bg-primary text-primary-foreground">
                                    <span>
                                        {user.email.charAt(0).toUpperCase()}
                                    </span>
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>
                                {user.email}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <a href="/my-account" class="w-full">My Account</a>
                            </DropdownMenuItem>
                            {#if user.role === 'admin' || user.role === 'owner'}
                                <DropdownMenuItem>
                                    <a href="/admin" class="flex w-full items-center">
                                        <ShieldIcon class="mr-2 h-4 w-4" />
                                        Admin Panel
                                    </a>
                                </DropdownMenuItem>
                            {/if}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onclick={handleSignOut}>Sign out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                {:else}
                    <!-- Sign In Icon Button -->
                    <div class="inline-flex cursor-pointer">
                        <a
                            href="/signin"
                            aria-label="Sign in"
                            class="text-foreground hover:text-muted-foreground inline-flex h-10 w-10 items-center justify-center transition-colors"
                        >
                            <UserIcon class="h-7 w-7" />
                        </a>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</header>
