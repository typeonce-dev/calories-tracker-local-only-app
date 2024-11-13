import { useMachine } from "@xstate/react";
import { Button, Form } from "react-aria-components";
import { machine } from "~/machines/create-plan";
import { _PlanInsert } from "~/schema/plan";
import QuantityField from "./QuantityField";

export default function CreatePlan() {
  const [snapshot, send] = useMachine(machine);

  if (snapshot.matches("Created")) {
    return <p>Plan created!</p>;
  }

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        send({ type: "plan.create" });
      }}
    >
      <QuantityField
        actor={snapshot.context.calories}
        schema={_PlanInsert.fields.calories}
        label="Calories"
        name="calories"
      />

      <QuantityField
        actor={snapshot.context.carbohydratesRatio}
        schema={_PlanInsert.fields.carbohydratesRatio}
        label="Carbohydrates Ratio"
        name="carbohydrates"
      />

      <QuantityField
        actor={snapshot.context.proteinsRatio}
        schema={_PlanInsert.fields.proteinsRatio}
        label="Proteins Ratio"
        name="proteins"
      />

      <QuantityField
        actor={snapshot.context.fatsRatio}
        schema={_PlanInsert.fields.fatsRatio}
        label="Fats Ratio"
        name="fats"
      />

      <Button type="submit" isDisabled={snapshot.matches("CreatingPlan")}>
        Submit
      </Button>

      {snapshot.context.submitError !== null && (
        <p>{snapshot.context.submitError}</p>
      )}
    </Form>
  );
}
