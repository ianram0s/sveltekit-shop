<script lang="ts">
    import { AlertCircleIcon } from '$lib/components/icons';

    let {
        value = $bindable(),
        placeholder = 'dd/mm/yyyy',
        error = '',
        class: className = '',
        id = '',
        name = '',
        ...props
    }: {
        value?: string;
        placeholder?: string;
        error?: string;
        class?: string;
        id?: string;
        name?: string;
        [key: string]: any;
    } = $props();

    let inputElement: HTMLInputElement;
    let isUserTyping = $state(false);

    $effect(() => {
        if (!isUserTyping && value && value !== inputElement?.value) {
            inputElement.value = value;
        }
    });

    function handleInput(event: Event) {
        isUserTyping = true;
        const target = event.target as HTMLInputElement;
        let inputValue = target.value.replace(/\D/g, '');

        if (inputValue.length > 8) {
            inputValue = inputValue.substring(0, 8);
        }

        let formattedValue = '';
        for (let i = 0; i < inputValue.length; i++) {
            if (i === 2 || i === 4) {
                formattedValue += '/';
            }
            formattedValue += inputValue[i];
        }

        target.value = formattedValue;
        value = formattedValue;

        setTimeout(() => {
            isUserTyping = false;
        }, 300);
    }

    function handlePaste(event: ClipboardEvent) {
        event.preventDefault();
        isUserTyping = true;
        const pastedText = event.clipboardData?.getData('text') || '';
        const digits = pastedText.replace(/\D/g, '');

        if (digits.length <= 8) {
            inputElement.value = '';
            for (const digit of digits) {
                inputElement.value += digit;
                handleInput({ target: inputElement } as any);
            }
        }

        setTimeout(() => {
            isUserTyping = false;
        }, 300);
    }

    function handleKeyDown(event: KeyboardEvent) {
        isUserTyping = true;
        const target = event.target as HTMLInputElement;
        const { selectionStart, selectionEnd } = target;

        if (event.key === 'Backspace' && selectionStart === selectionEnd) {
            const pos = selectionStart || 0;
            const currentValue = target.value;

            if (pos > 0 && currentValue[pos - 1] === '/') {
                event.preventDefault();
                const newValue = currentValue.slice(0, pos - 2) + currentValue.slice(pos);
                target.value = newValue;
                target.setSelectionRange(pos - 2, pos - 2);
                handleInput(event);
            }
        }

        setTimeout(() => {
            isUserTyping = false;
        }, 300);
    }

    function handleBlur() {
        if (inputElement.value) {
            value = inputElement.value;
        } else {
            value = undefined;
        }
        isUserTyping = false;
    }

    function getFormatError() {
        if (!value) return '';

        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!regex.test(value)) {
            return 'Please enter date in dd/mm/yyyy format';
        }

        return '';
    }

    let formatError = $derived(getFormatError());
    let finalError = $derived(error || formatError);
</script>

<div class="relative">
    <input
        bind:this={inputElement}
        {id}
        {name}
        {placeholder}
        value={value || ''}
        oninput={handleInput}
        onpaste={handlePaste}
        onkeydown={handleKeyDown}
        onblur={handleBlur}
        type="text"
        maxlength="10"
        class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {finalError
            ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
            : 'border-input'} {className}"
        {...props}
    />
    {#if finalError}
        <div class="mt-1 flex items-center space-x-1">
            <AlertCircleIcon class="text-destructive h-4 w-4" />
            <p class="text-destructive text-sm">{finalError}</p>
        </div>
    {/if}
</div>
