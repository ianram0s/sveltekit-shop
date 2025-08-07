import type { Product } from '$lib/types/product';

export interface CartItem {
    product: Product;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
}

export const cartState = $state({
    items: [] as CartItem[],
    totalItems: 0,
    totalPrice: 0,
    isLoaded: false
});

if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            const parsedCart = JSON.parse(savedCart);
            cartState.items = parsedCart.items || [];
            cartState.totalItems = parsedCart.totalItems || 0;
            cartState.totalPrice = parsedCart.totalPrice || 0;
        } catch (error) {
            console.error('Failed to parse saved cart:', error);
        }
    }
    cartState.isLoaded = true;
}

function saveToLocalStorage() {
    if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify({
            items: cartState.items,
            totalItems: cartState.totalItems,
            totalPrice: cartState.totalPrice
        }));
    }
}

function calculateTotals() {
    cartState.totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
    cartState.totalPrice = cartState.items.reduce(
        (sum, item) => sum + Number(item.product.currentPrice) * item.quantity,
        0
    );
}

export function addToCart(product: Product, quantity: number = 1, selectedColor?: string, selectedSize?: string) {
    const existingItemIndex = cartState.items.findIndex(
        (item) => item.product.id === product.id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
    );

    if (existingItemIndex >= 0) {
        cartState.items[existingItemIndex].quantity += quantity;
    } else {
        cartState.items.push({
            product,
            quantity,
            selectedColor,
            selectedSize
        });
    }

    calculateTotals();
    saveToLocalStorage();
}

export function removeFromCart(productId: string, selectedColor?: string, selectedSize?: string) {
    cartState.items = cartState.items.filter((item) =>
        !(item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize)
    );
    calculateTotals();
    saveToLocalStorage();
}

export function updateCartQuantity(productId: string, quantity: number, selectedColor?: string, selectedSize?: string) {
    const itemIndex = cartState.items.findIndex((item) =>
        item.product.id === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );
    if (itemIndex >= 0) {
        if (quantity <= 0) {
            cartState.items.splice(itemIndex, 1);
        } else {
            cartState.items[itemIndex].quantity = quantity;
        }
    }
    calculateTotals();
    saveToLocalStorage();
}

export function clearCart() {
    cartState.items = [];
    cartState.totalItems = 0;
    cartState.totalPrice = 0;
    saveToLocalStorage();
}

export function getItemQuantity(productId: string, selectedColor?: string, selectedSize?: string): number {
    const item = cartState.items.find((item) =>
        item.product.id === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );
    return item ? item.quantity : 0;
} 