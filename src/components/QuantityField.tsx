import { useSelector } from "@xstate/react";
import type { Schema } from "effect";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button, Group } from "react-aria-components";
import type { ActorRefFrom } from "xstate";
import type { numberFieldActor } from "~/machines/number-field";
import type { optionalNumberFieldActor } from "~/machines/optional-number-field";
import { validate } from "~/utils";
import { NumberField } from "./NumberField";
import { FieldError, Input, Label } from "./TextField";

export default function QuantityField({
  actor,
  label,
  schema,
  name,
}: {
  actor: ActorRefFrom<
    typeof numberFieldActor | typeof optionalNumberFieldActor
  >;
  label: string;
  name: string;
  schema: Schema.Schema.AnyNoContext;
}) {
  const contextValue = useSelector(actor, (snapshot) => snapshot.context.value);
  const value = contextValue !== undefined ? contextValue / 10 : undefined;
  return (
    <NumberField
      name={name}
      step={0.1}
      minValue={0}
      value={value ?? 0}
      validate={validate(schema)}
      onChange={(value) => actor.send({ type: "update", value })}
      className="flex flex-col gap-y-1 items-center w-full"
    >
      <Label className="text-sm font-medium">{label}</Label>
      <Group className="flex items-center gap-x-2 w-full">
        <Button
          slot="decrement"
          className="h-6 w-6 border flex items-center justify-center rounded-full border-slate-200"
        >
          <MinusIcon size={12} />
        </Button>
        <Input className="flex-1 text-center" placeholder="0.0" />
        <Button
          slot="increment"
          className="h-6 w-6 border flex items-center justify-center rounded-full border-slate-200"
        >
          <PlusIcon size={12} />
        </Button>
      </Group>
      <Group className="text-center">
        <FieldError />
      </Group>
    </NumberField>
  );
}
