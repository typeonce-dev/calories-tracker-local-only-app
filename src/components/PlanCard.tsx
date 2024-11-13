import { useMachine } from "@xstate/react";
import { Button, Form, Group } from "react-aria-components";
import { machine } from "~/machines/manage-plan";
import type { planTable } from "~/schema/drizzle";
import { _PlanUpdate } from "~/schema/plan";
import QuantityField from "./QuantityField";

export default function PlanCard({
  plan,
}: {
  plan: typeof planTable.$inferSelect;
}) {
  const [snapshot, send] = useMachine(machine, {
    input: {
      calories: plan.calories,
      fatsRatio: plan.fatsRatio,
      carbohydratesRatio: plan.carbohydratesRatio,
      proteinsRatio: plan.proteinsRatio,
    },
  });
  return (
    <div className="p-2 border border-slate-300">
      <p>{plan.calories}</p>
      <Group>
        <p>{plan.carbohydratesRatio}</p>
        <p>{plan.proteinsRatio}</p>
        <p>{plan.fatsRatio}</p>
      </Group>

      <Form
        onSubmit={(event) => {
          event.preventDefault();
          send({ type: "plan.update", id: plan.id });
        }}
      >
        <QuantityField
          actor={snapshot.context.calories}
          schema={_PlanUpdate.fields.calories}
          label="Calories"
          name="calories"
        />

        <QuantityField
          actor={snapshot.context.carbohydratesRatio}
          schema={_PlanUpdate.fields.carbohydratesRatio}
          label="Carbohydrates Ratio"
          name="carbohydrates"
        />

        <QuantityField
          actor={snapshot.context.proteinsRatio}
          schema={_PlanUpdate.fields.proteinsRatio}
          label="Proteins Ratio"
          name="proteins"
        />

        <QuantityField
          actor={snapshot.context.fatsRatio}
          schema={_PlanUpdate.fields.fatsRatio}
          label="Fats Ratio"
          name="fats"
        />

        <Button type="submit" isDisabled={snapshot.matches("Updating")}>
          Update
        </Button>
      </Form>
    </div>
  );
}
