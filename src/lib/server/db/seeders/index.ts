import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../schema.js';
import { seeder } from '../schema.js';
import { eq } from 'drizzle-orm';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { schema });

export interface SeederFunction {
	name: string;
	run: () => Promise<void>;
}

export async function runSeeders(seeders: SeederFunction[]) {
	console.log('Starting seeder execution...');
	
	for (const seederFn of seeders) {
		const existingSeeder = await db
			.select()
			.from(seeder)
			.where(eq(seeder.name, seederFn.name))
			.limit(1);
		
		if (existingSeeder.length > 0) {
			console.log(`⏭️  Skipping seeder '${seederFn.name}' - already executed`);
			continue;
		}
		
		console.log(`🌱 Running seeder '${seederFn.name}'...`);
		
		try {
			await seederFn.run();
			
			await db.insert(seeder).values({
				id: crypto.randomUUID(),
				name: seederFn.name
			});
			
			console.log(`✅ Seeder '${seederFn.name}' completed successfully`);
		} catch (error) {
			console.error(`❌ Seeder '${seederFn.name}' failed:`, error);
			throw error;
		}
	}
	
	console.log('All seeders completed!');
} 