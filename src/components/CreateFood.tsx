import { useMachine, useSelector } from "@xstate/react";
import { Match, Schema } from "effect";
import { Button, Group } from "react-aria-components";
import type { ActorRefFrom } from "xstate";
import { machine } from "~/machines/create-food";
import type { textFieldMachine } from "~/machines/text-field";
import { FoodInsert } from "~/schema/food";
import { validate } from "~/utils";
import { Dialog, DialogTrigger } from "./Dialog";
import { Modal, ModalOverlay } from "./Modal";
import QuantityField from "./QuantityField";
import { FieldError, Input, Label, TextField } from "./TextField";

export default function CreateFood() {
  const [snapshot, send] = useMachine(machine);
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
                      schema={FoodInsert.fields.name}
                      label="Name"
                      name="name"
                    />

                    <TextFieldFromActor
                      actor={snapshot.context.brand}
                      schema={FoodInsert.fields.brand}
                      label="Brand"
                      name="brand"
                    />

                    <QuantityField
                      actor={snapshot.context.calories}
                      schema={FoodInsert.fields.calories}
                      label="Calories"
                      name="calories"
                    />

                    <QuantityField
                      actor={snapshot.context.carbohydrates}
                      schema={FoodInsert.fields.carbohydrates}
                      label="Carbohydrates"
                      name="carbohydrates"
                    />

                    <QuantityField
                      actor={snapshot.context.sugars}
                      schema={FoodInsert.fields.sugars}
                      label="Sugars"
                      name="sugars"
                    />

                    <QuantityField
                      actor={snapshot.context.fibers}
                      schema={FoodInsert.fields.fibers}
                      label="Fibers"
                      name="fibers"
                    />

                    <QuantityField
                      actor={snapshot.context.proteins}
                      schema={FoodInsert.fields.proteins}
                      label="Proteins"
                      name="proteins"
                    />

                    <QuantityField
                      actor={snapshot.context.fats}
                      schema={FoodInsert.fields.fats}
                      label="Fats"
                      name="fats"
                    />

                    <QuantityField
                      actor={snapshot.context.fatsSaturated}
                      schema={FoodInsert.fields.fatsSaturated}
                      label="Fats Saturated"
                      name="fatsSaturated"
                    />

                    <QuantityField
                      actor={snapshot.context.salt}
                      schema={FoodInsert.fields.salt}
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
