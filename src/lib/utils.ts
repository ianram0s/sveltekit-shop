import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Formats a date string from yyyy-mm-dd to dd/MM/yyyy
 * @param dateString - Date string in yyyy-mm-dd format or any valid date string
 * @returns Formatted date string in dd/MM/yyyy format, or empty string if invalid
 */
export function formatDate(dateString: string | null | undefined): string {
	if (!dateString) return '';
	
	const date = new Date(dateString);
	if (isNaN(date.getTime())) return '';
	
	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const year = date.getUTCFullYear();
	
	return `${day}/${month}/${year}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
