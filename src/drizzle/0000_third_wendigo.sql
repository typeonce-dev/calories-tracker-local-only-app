CREATE TYPE "public"."meal" AS ENUM('breakfast', 'lunch', 'dinner', 'snacks');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_log" (
	"date" date PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "food" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "food_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"brand" varchar(255),
	"calories" integer NOT NULL,
	"fats" integer NOT NULL,
	"fatsSaturated" integer DEFAULT 0 NOT NULL,
	"salt" integer DEFAULT 0 NOT NULL,
	"carbohydrates" integer NOT NULL,
	"fibers" integer DEFAULT 0 NOT NULL,
	"sugars" integer DEFAULT 0 NOT NULL,
	"proteins" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plan" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "plan_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"calories" integer NOT NULL,
	"fatsRatio" integer NOT NULL,
	"carbohydratesRatio" integer NOT NULL,
	"proteinsRatio" integer NOT NULL,
	"isCurrent" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serving" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "serving_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"meal" "meal" NOT NULL,
	"quantity" integer NOT NULL,
	"food_id" integer NOT NULL,
	"daily_log_date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system" (
	"version" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_log" ADD CONSTRAINT "daily_log_plan_id_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plan"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serving" ADD CONSTRAINT "serving_food_id_food_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serving" ADD CONSTRAINT "serving_daily_log_date_daily_log_date_fk" FOREIGN KEY ("daily_log_date") REFERENCES "public"."daily_log"("date") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "food" USING btree ("name");