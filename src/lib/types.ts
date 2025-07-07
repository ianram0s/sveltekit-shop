export interface User {
	id: string;
	email: string;
	name: string;
	image?: string;
	emailVerified?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface Session {
	user: User;
	token: string;
	expiresAt: Date;
} 