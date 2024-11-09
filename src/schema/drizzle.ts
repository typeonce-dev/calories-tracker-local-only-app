import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  varchar,
} from "drizzle-orm/pg-core";

export const mealEnum = pgEnum("meal", [
  "breakfast",
  "lunch",
  "dinner",
  "snacks",
]);

export const foodTable = pgTable(
  "food",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    brand: varchar({ length: 255 }),
    calories: integer().notNull(),
    fats: integer().notNull(),
    fatsSaturated: integer().notNull().default(0),
    salt: integer().notNull().default(0),
    carbohydrates: integer().notNull(),
    fibers: integer().notNull().default(0),
    sugars: integer().notNull().default(0),
    proteins: integer().notNull(),
  },
  (table) => {
    return {
      nameIdx: index("name_idx").on(table.name),
    };
  }
);

export const servingTable = pgTable("serving", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  meal: mealEnum().notNull(),
  quantity: integer().notNull(),
  foodId: integer("food_id").references(() => foodTable.id),
  dailyLogDate: date("daily_log_date").references(() => dailyLogTable.date),
});

export const planTable = pgTable("plan", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  calories: integer().notNull(),
  fatsRatio: integer().notNull(),
  carbohydratesRatio: integer().notNull(),
  proteinsRatio: integer().notNull(),
});

export const dailyLogTable = pgTable("daily_log", {
  date: date().primaryKey(),
  planId: integer("plan_id").references(() => planTable.id),
});
