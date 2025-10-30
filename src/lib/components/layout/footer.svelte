<script lang="ts">
    import { ThemeSwitcher } from '$lib/components/theme-switcher';
</script>

<footer class="bg-background border-t">
    <div class="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
            <div class="text-muted-foreground text-xs sm:text-sm">
                <span class="sm:hidden">ianram0s.dev © 2025</span>
                <span class="hidden sm:inline">ianram0s.dev © 2025. All Rights Reserved</span>
            </div>
            <div class="flex items-center">
                <div class="scale-90 sm:scale-100">
                    <ThemeSwitcher />
                </div>
            </div>
        </div>
    </div>
</footer>
