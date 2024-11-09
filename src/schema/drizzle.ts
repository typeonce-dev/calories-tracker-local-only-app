import { date, integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const foodTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  brand: varchar({ length: 255 }),
  calories: integer().notNull(),
  fat: integer().notNull(),
  fatSaturated: integer().notNull().default(0),
  salt: integer().notNull().default(0),
  carbohydrates: integer().notNull(),
  fibers: integer().notNull().default(0),
  sugars: integer().notNull().default(0),
  proteins: integer().notNull(),
});

export const mealEnum = pgEnum("meal", [
  "breakfast",
  "lunch",
  "dinner",
  "snacks",
]);

export const servingTable = pgTable("users", {
  date: date().primaryKey(),
  meal: mealEnum().notNull(),
  foodId: integer("food_id").references(() => foodTable.id),
  quantity: integer().notNull(),
});
