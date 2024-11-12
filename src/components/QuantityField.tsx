import { Button, Group } from "react-aria-components";
import { validate } from "~/utils";
import { NumberField } from "./NumberField";
import { FieldError, Input, Label } from "./TextField";
import { useSelector } from "@xstate/react";
import type { Schema } from "effect";
import type { ActorRefFrom } from "xstate";
import type { numberFieldMachine } from "~/machines/number-field";

export default function QuantityField({
  actor,
  label,
  schema,
  name,
}: {
  actor: ActorRefFrom<typeof numberFieldMachine>;
  label: string;
  name: string;
  schema: Schema.Schema.AnyNoContext;
}) {
  const context = useSelector(actor, (snapshot) => snapshot.context);
  return (
    <NumberField
      name={name}
      step={0.1}
      minValue={0}
      value={context.value}
      validate={validate(schema)}
      onChange={(value) => actor.send({ type: "update", value })}
    >
      <Label>{label}</Label>
      <Group>
        <Button slot="decrement">-</Button>
        <Input />
        <Button slot="increment">+</Button>
      </Group>
      <Group>
        <FieldError />
      </Group>
    </NumberField>
  );
}
