import { useMachine } from "@xstate/react";
import { Button, Form } from "react-aria-components";
import { machine } from "~/machines/manage-plan";
import { _PlanUpdate } from "~/schema/plan";
import type { PlanWithLogsCount } from "~/type";
import { cn } from "~/utils";
import PlanInfo from "./PlanInfo";
import QuantityField from "./QuantityField";

export default function PlanCard({ plan }: { plan: PlanWithLogsCount }) {
  const [snapshot, send] = useMachine(machine, {
    input: {
      calories: plan.calories,
      fatsRatio: plan.fatsRatio,
      carbohydratesRatio: plan.carbohydratesRatio,
      proteinsRatio: plan.proteinsRatio,
    },
  });
  return (
    <div
      className={cn(
        plan.isCurrent && "bg-slate-200",
        "p-2 border border-slate-300"
      )}
    >
      <p>{plan.logs} days</p>
      <PlanInfo plan={plan} />

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

      <Button
        type="button"
        isDisabled={snapshot.matches("Setting")}
        onPress={() => send({ type: "plan.set", id: plan.id })}
      >
        Set as current plan
      </Button>

      {plan.logs === 0 && (
        <Button
          type="button"
          isDisabled={snapshot.matches("Removing")}
          onPress={() => send({ type: "plan.remove", id: plan.id })}
        >
          Remove
        </Button>
      )}
    </div>
  );
}
