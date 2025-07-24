import type { Product } from '$lib/types/product';

export interface CartItem {
    product: Product;
    quantity: number;
}

export const cartState = $state({
    items: [] as CartItem[],
    totalItems: 0,
    totalPrice: 0
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

export function addToCart(product: Product, quantity: number = 1) {
    const existingItemIndex = cartState.items.findIndex(
        (item) => item.product.id === product.id
    );

    if (existingItemIndex >= 0) {
        cartState.items[existingItemIndex].quantity += quantity;
    } else {
        cartState.items.push({ product, quantity });
    }

    calculateTotals();
    saveToLocalStorage();
}

export function removeFromCart(productId: string) {
    cartState.items = cartState.items.filter((item) => item.product.id !== productId);
    calculateTotals();
    saveToLocalStorage();
}

export function updateCartQuantity(productId: string, quantity: number) {
    const itemIndex = cartState.items.findIndex((item) => item.product.id === productId);
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

export function getItemQuantity(productId: string): number {
    const item = cartState.items.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
} 