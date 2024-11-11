import { useMachine, useSelector } from "@xstate/react";
import { Either, Match, Schema } from "effect";
import { Button, Group } from "react-aria-components";
import type { ActorRefFrom } from "xstate";
import { machine } from "~/machines/create-food";
import type { numberFieldMachine } from "~/machines/number-field";
import type { textFieldMachine } from "~/machines/text-field";
import { Food } from "~/schema/food";
import { Dialog, DialogTrigger } from "./Dialog";
import { Modal, ModalOverlay } from "./Modal";
import { NumberField } from "./NumberField";
import { FieldError, Input, Label, TextField } from "./TextField";

export default function CreateFood() {
  const [snapshot, send] = useMachine(machine);
  console.log(snapshot.context);

  return (
    <DialogTrigger>
      <Button>Create food</Button>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            {({ close }) =>
              Match.value(snapshot.value).pipe(
                Match.when("Editing", () => (
                  <div>
                    <TextFieldFromActor
                      actor={snapshot.context.name}
                      schema={Food.fields.name}
                      label="Name"
                      name="name"
                    />

                    <TextFieldFromActor
                      actor={snapshot.context.brand}
                      schema={Food.fields.brand}
                      label="Brand"
                      name="brand"
                    />

                    <QuantityField
                      actor={snapshot.context.calories}
                      schema={Food.fields.calories}
                      label="Calories"
                      name="calories"
                    />

                    <QuantityField
                      actor={snapshot.context.carbohydrates}
                      schema={Food.fields.carbohydrates}
                      label="Carbohydrates"
                      name="carbohydrates"
                    />

                    <QuantityField
                      actor={snapshot.context.sugars}
                      schema={Food.fields.sugars}
                      label="Sugars"
                      name="sugars"
                    />

                    <QuantityField
                      actor={snapshot.context.fibers}
                      schema={Food.fields.fibers}
                      label="Fibers"
                      name="fibers"
                    />

                    <QuantityField
                      actor={snapshot.context.proteins}
                      schema={Food.fields.proteins}
                      label="Proteins"
                      name="proteins"
                    />

                    <QuantityField
                      actor={snapshot.context.fats}
                      schema={Food.fields.fats}
                      label="Fats"
                      name="fats"
                    />

                    <QuantityField
                      actor={snapshot.context.fatsSaturated}
                      schema={Food.fields.fatsSaturated}
                      label="Fats Saturated"
                      name="fatsSaturated"
                    />

                    <QuantityField
                      actor={snapshot.context.salt}
                      schema={Food.fields.salt}
                      label="Salt"
                      name="salt"
                    />

                    <Button onPress={() => send({ type: "food.create" })}>
                      Create
                    </Button>

                    {snapshot.context.submitError !== null && (
                      <p>{snapshot.context.submitError}</p>
                    )}
                  </div>
                )),
                Match.when("Creating", () => <p>...</p>),
                Match.when("Created", () => (
                  <div>
                    <p>Done</p>
                    <Button onPress={close}>Close</Button>
                  </div>
                )),
                Match.exhaustive
              )
            }
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

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
      onChange={(value) => actor.send({ type: "update", value })}
      validate={(value) =>
        Schema.decodeEither(schema)(value).pipe(
          Either.flip,
          Either.map((error) => error.message),
          Either.getOrNull
        )
      }
    >
      <Label>{label}</Label>
      <Input />
      <FieldError />
    </TextField>
  );
};

const QuantityField = ({
  actor,
  label,
  schema,
  name,
}: {
  actor: ActorRefFrom<typeof numberFieldMachine>;
  label: string;
  name: string;
  schema: Schema.Schema.AnyNoContext;
}) => {
  const context = useSelector(actor, (snapshot) => snapshot.context);
  return (
    <NumberField
      name={name}
      step={1}
      minValue={1}
      value={context.value}
      onChange={(value) => actor.send({ type: "update", value })}
      validate={(value) =>
        Schema.decodeEither(schema)(value).pipe(
          Either.flip,
          Either.map((error) => error.message),
          Either.getOrNull
        )
      }
    >
      <Label>{label}</Label>
      <Group>
        <Button slot="decrement">-</Button>
        <Input />
        <Button slot="increment">+</Button>
      </Group>
    </NumberField>
  );
};