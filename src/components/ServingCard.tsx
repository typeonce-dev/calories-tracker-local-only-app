import { useMachine } from "@xstate/react";
import { Button, Group } from "react-aria-components";
import { machine } from "~/machines/manage-serving";
import { ServingUpdate } from "~/schema/serving";
import type { ServingFood } from "~/type";
import QuantityField from "./QuantityField";

export default function ServingCard({ log }: { log: ServingFood }) {
  const [snapshot, send] = useMachine(machine, {
    input: { quantity: log.quantity },
  });
  return (
    <div className="p-2 border border-slate-300">
      <p className="font-bold">{log.name}</p>
      <p>{log.quantity}g</p>
      <p>{(log.quantity / 100) * log.calories}kcal</p>
      <p>{(log.quantity / 100) * log.carbohydrates}carbohydrates</p>
      <p>{(log.quantity / 100) * log.fats}fats</p>
      <p>{(log.quantity / 100) * log.proteins}proteins</p>
      <Group>
        <QuantityField
          actor={snapshot.context.quantity}
          schema={ServingUpdate.fields.quantity}
          label="Quantity"
          name="quantity"
        />
      </Group>
      <Group>
        <Button onPress={() => send({ type: "serving.remove", id: log.id })}>
          Remove
        </Button>
        <Button onPress={() => send({ type: "serving.update", id: log.id })}>
          Update
        </Button>
      </Group>
    </div>
  );
}
