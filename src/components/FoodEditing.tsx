import { useSelector } from "@xstate/react";
import type { Schema } from "effect";
import type React from "react";
import { Form, Group } from "react-aria-components";
import type { ActorRefFrom } from "xstate";
import type { numberFieldActor } from "~/machines/number-field";
import type { optionalNumberFieldActor } from "~/machines/optional-number-field";
import type { textFieldActor } from "~/machines/text-field";
import { FoodInsert } from "~/schema/food";
import { validate } from "~/utils";
import QuantityField from "./QuantityField";
import { FieldError, Input, Label, TextField } from "./TextField";

const TextFieldFromActor = ({
  actor,
  label,
  schema,
  name,
}: {
  actor: ActorRefFrom<typeof textFieldActor>;
  label: string;
  name: string;
  schema: Schema.Schema.AnyNoContext;
}) => {
  const context = useSelector(actor, (snapshot) => snapshot.context);
  return (
    <TextField
      name={name}
      value={context.value}
      validate={validate(schema)}
      onChange={(value) => actor.send({ type: "update", value })}
      className="flex flex-col gap-y-1 items-center w-full"
    >
      <Label className="text-sm font-medium">{label}</Label>
      <Input className="w-full text-center" placeholder={label} />
      <Group>
        <FieldError />
      </Group>
    </TextField>
  );
};

export default function FoodEditing({
  nameActor,
  brandActor,
  caloriesActor,
  carbohydratesActor,
  sugarsActor,
  fibersActor,
  proteinsActor,
  fatsActor,
  fatsSaturatedActor,
  saltActor,
  children,
  onSubmit,
}: {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  nameActor: ActorRefFrom<typeof textFieldActor>;
  brandActor: ActorRefFrom<typeof textFieldActor>;
  caloriesActor: ActorRefFrom<typeof numberFieldActor>;
  carbohydratesActor: ActorRefFrom<typeof numberFieldActor>;
  proteinsActor: ActorRefFrom<typeof numberFieldActor>;
  fatsActor: ActorRefFrom<typeof numberFieldActor>;
  fatsSaturatedActor: ActorRefFrom<typeof optionalNumberFieldActor>;
  saltActor: ActorRefFrom<typeof optionalNumberFieldActor>;
  sugarsActor: ActorRefFrom<typeof optionalNumberFieldActor>;
  fibersActor: ActorRefFrom<typeof optionalNumberFieldActor>;
}) {
  return (
    <Form
      className="flex flex-col gap-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
    >
      <TextFieldFromActor
        actor={nameActor}
        schema={FoodInsert.fields.name}
        label="Name"
        name="name"
      />

      <TextFieldFromActor
        actor={brandActor}
        schema={FoodInsert.fields.brand}
        label="Brand"
        name="brand"
      />

      <QuantityField
        actor={caloriesActor}
        schema={FoodInsert.fields.calories}
        label="Calories"
        name="calories"
      />

      <QuantityField
        actor={carbohydratesActor}
        schema={FoodInsert.fields.carbohydrates}
        label="Carbohydrates"
        name="carbohydrates"
      />

      <QuantityField
        actor={sugarsActor}
        schema={FoodInsert.fields.sugars}
        label="Sugars"
        name="sugars"
      />

      <QuantityField
        actor={fibersActor}
        schema={FoodInsert.fields.fibers}
        label="Fibers"
        name="fibers"
      />

      <QuantityField
        actor={proteinsActor}
        schema={FoodInsert.fields.proteins}
        label="Proteins"
        name="proteins"
      />

      <QuantityField
        actor={fatsActor}
        schema={FoodInsert.fields.fats}
        label="Fats"
        name="fats"
      />

      <QuantityField
        actor={fatsSaturatedActor}
        schema={FoodInsert.fields.fatsSaturated}
        label="Fats Saturated"
        name="fatsSaturated"
      />

      <QuantityField
        actor={saltActor}
        schema={FoodInsert.fields.salt}
        label="Salt"
        name="salt"
      />

      {children}
    </Form>
  );
}
