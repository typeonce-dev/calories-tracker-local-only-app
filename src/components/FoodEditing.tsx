import { useSelector } from "@xstate/react";
import type { Schema } from "effect";
import type React from "react";
import {
  FieldError,
  Form,
  Group,
  Input,
  Label,
  TextField,
} from "react-aria-components";
import type { ActorRefFrom } from "xstate";
import type { numberFieldMachine } from "~/machines/number-field";
import type { textFieldMachine } from "~/machines/text-field";
import { FoodInsert } from "~/schema/food";
import { validate } from "~/utils";
import QuantityField from "./QuantityField";

const TextFieldFromActor = ({
  actor,
  label,
  schema,
  name,
}: {
  actor: ActorRefFrom<typeof textFieldMachine>;
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
    >
      <Label>{label}</Label>
      <Input />
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
  nameActor: ActorRefFrom<typeof textFieldMachine>;
  brandActor: ActorRefFrom<typeof textFieldMachine>;
  caloriesActor: ActorRefFrom<typeof numberFieldMachine>;
  carbohydratesActor: ActorRefFrom<typeof numberFieldMachine>;
  sugarsActor: ActorRefFrom<typeof numberFieldMachine>;
  fibersActor: ActorRefFrom<typeof numberFieldMachine>;
  proteinsActor: ActorRefFrom<typeof numberFieldMachine>;
  fatsActor: ActorRefFrom<typeof numberFieldMachine>;
  fatsSaturatedActor: ActorRefFrom<typeof numberFieldMachine>;
  saltActor: ActorRefFrom<typeof numberFieldMachine>;
}) {
  return (
    <Form
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
