import { Schema } from "effect";

export const Meal = Schema.Literal("breakfast", "lunch", "dinner", "snacks");
