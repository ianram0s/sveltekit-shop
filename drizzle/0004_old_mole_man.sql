CREATE TABLE "seeder" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"executed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "seeder_name_unique" UNIQUE("name")
);
