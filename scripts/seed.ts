#!/usr/bin/env tsx

import 'dotenv/config';

import { runSeeders } from '../src/lib/server/db/seeders/index.js';
import type { SeederFunction } from '../src/lib/server/db/seeders/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadAllSeeders(): Promise<SeederFunction[]> {
	const seedersDir = path.join(__dirname, '../src/lib/server/db/seeders');
	const files = fs.readdirSync(seedersDir);
	
	// Filter for TypeScript files, excluding index.ts
	const seederFiles = files.filter(file => 
		file.endsWith('.ts') && 
		file !== 'index.ts' && 
		!file.endsWith('.d.ts')
	);
	
	console.log(`Found ${seederFiles.length} seeder files: ${seederFiles.join(', ')}`);
	
	const seeders: SeederFunction[] = [];
	
	for (const file of seederFiles) {
		try {
			const filePath = path.join(seedersDir, file);
			const module = await import(filePath);
			
			// Look for exported seeder functions
			// They should be named like 'adminSeeder', 'userSeeder', etc.
			const exportedSeeders = Object.values(module).filter(
				(exported): exported is SeederFunction => {
					if (!exported || typeof exported !== 'object' || exported === null) {
						return false;
					}
					const obj = exported as Record<string, unknown>;
					return 'name' in obj && 'run' in obj && typeof obj.run === 'function';
				}
			);
			
			if (exportedSeeders.length === 0) {
				console.warn(`⚠️  No seeder functions found in ${file}`);
			} else {
				seeders.push(...exportedSeeders);
				console.log(`✅ Loaded ${exportedSeeders.length} seeder(s) from ${file}`);
			}
		} catch (error) {
			console.error(`❌ Failed to load seeder from ${file}:`, error);
		}
	}
	
	return seeders;
}

async function main() {
	console.log('🌱 Starting database seeding...\n');
	
	try {
		const seeders = await loadAllSeeders();
		
		if (seeders.length === 0) {
			console.log('📭 No seeders found to run');
			return;
		}
		
		console.log(`\n🚀 Running ${seeders.length} seeder(s)...\n`);
		
		await runSeeders(seeders);
		
		console.log('\n🎉 Database seeding completed successfully!');
		process.exit(0);
	} catch (error) {
		console.error('\n💥 Database seeding failed:', error);
		process.exit(1);
	}
}

main(); 