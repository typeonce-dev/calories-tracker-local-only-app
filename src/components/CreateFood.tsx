import { useMachine } from "@xstate/react";
import { Match } from "effect";
import { Button, Group } from "react-aria-components";
import { machine, type ContextKey } from "~/machines/create-food";
import { Dialog, DialogTrigger } from "./Dialog";
import { Modal, ModalOverlay } from "./Modal";
import { NumberField } from "./NumberField";
import { Input, Label, TextField } from "./TextField";

const QuantityField = <K extends ContextKey>({
  contextKey,
  onChange,
  value,
}: {
  value: (k: K) => number | undefined;
  contextKey: K;
  onChange: (k: K) => (value: number) => void;
}) => {
  return (
    <NumberField
      name={contextKey}
      step={1}
      minValue={1}
      value={value(contextKey)}
      onChange={onChange(contextKey)}
    >
      <Label>{contextKey}</Label>
      <Group>
        <Button slot="decrement">-</Button>
        <Input />
        <Button slot="increment">+</Button>
      </Group>
    </NumberField>
  );
};

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
                    <TextField
                      name="name"
                      value={snapshot.context.name}
                      onChange={(name) => send({ type: "name.update", name })}
                    >
                      <Label>Name</Label>
                      <Input />
                    </TextField>
                    <TextField
                      name="brand"
                      value={snapshot.context.brand}
                      onChange={(brand) =>
                        send({ type: "brand.update", brand })
                      }
                    >
                      <Label>Brand</Label>
                      <Input />
                    </TextField>

                    <QuantityField
                      contextKey="calories"
                      value={(key) => snapshot.context[key]}
                      onChange={(contextKey) => (value) =>
                        send({
                          type: "quantity.update",
                          contextKey,
                          value,
                        })
                      }
                    />
                    <QuantityField
                      contextKey="carbohydrates"
                      value={(key) => snapshot.context[key]}
                      onChange={(contextKey) => (value) =>
                        send({
                          type: "quantity.update",
                          contextKey,
                          value,
                        })
                      }
                    />
                    <QuantityField
                      contextKey="sugars"
                      value={(key) => snapshot.context[key]}
                      onChange={(contextKey) => (value) =>
                        send({
                          type: "quantity.update",
                          contextKey,
                          value,
                        })
                      }
                    />
                    <QuantityField
                      contextKey="fibers"
                      value={(key) => snapshot.context[key]}
                      onChange={(contextKey) => (value) =>
                        send({
                          type: "quantity.update",
                          contextKey,
                          value,
                        })
                      }
                    />
                    <QuantityField
                      contextKey="fats"
                      value={(key) => snapshot.context[key]}
                      onChange={(contextKey) => (value) =>
                        send({
                          type: "quantity.update",
                          contextKey,
                          value,
                        })
                      }
                    />
                    <QuantityField
                      contextKey="fatsSaturated"
                      value={(key) => snapshot.context[key]}
                      onChange={(contextKey) => (value) =>
                        send({
                          type: "quantity.update",
                          contextKey,
                          value,
                        })
                      }
                    />

                    <QuantityField
                      contextKey="proteins"
                      value={(key) => snapshot.context[key]}
                      onChange={(contextKey) => (value) =>
                        send({
                          type: "quantity.update",
                          contextKey,
                          value,
                        })
                      }
                    />
                    <QuantityField
                      contextKey="salt"
                      value={(key) => snapshot.context[key]}
                      onChange={(contextKey) => (value) =>
                        send({
                          type: "quantity.update",
                          contextKey,
                          value,
                        })
                      }
                    />

                    <Button
                      isDisabled={!snapshot.can({ type: "food.create" })}
                      onPress={() => send({ type: "food.create" })}
                    >
                      Create
                    </Button>
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
