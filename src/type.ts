import type { foodTable, planTable, servingTable } from "./schema/drizzle";

export interface ServingFood {
  id: (typeof servingTable.$inferSelect)["id"];
  meal: (typeof servingTable.$inferSelect)["meal"];
  quantity: (typeof servingTable.$inferSelect)["quantity"];
  foodId: (typeof foodTable.$inferSelect)["id"];
  name: (typeof foodTable.$inferSelect)["name"];
  brand: (typeof foodTable.$inferSelect)["brand"];
  calories: (typeof foodTable.$inferSelect)["calories"];
  fats: (typeof foodTable.$inferSelect)["fats"];
  carbohydrates: (typeof foodTable.$inferSelect)["carbohydrates"];
  proteins: (typeof foodTable.$inferSelect)["proteins"];
}

export type PlanWithLogsCount = typeof planTable.$inferSelect & {
  logs: number;
};
