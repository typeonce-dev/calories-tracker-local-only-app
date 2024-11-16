import { ListPlusIcon } from "lucide-react";
import { Button as AriaButton, Group } from "react-aria-components";
import { useFoods } from "~/hooks/use-foods";
import type { DailyLogSelect } from "~/schema/daily-log";
import type { Meal } from "~/schema/shared";
import CreateFood from "./CreateFood";
import CreateServing from "./CreateServing";
import { Dialog, DialogTrigger } from "./Dialog";
import { Modal, ModalOverlay } from "./Modal";
import UpdateFood from "./UpdateFood";

export default function SelectFood({
  meal,
  dailyLogDate,
}: {
  meal: typeof Meal.Type;
  dailyLogDate: typeof DailyLogSelect.fields.date.Type;
}) {
  const foods = useFoods();
  return (
    <DialogTrigger>
      <AriaButton className="focus:outline-none">
        <ListPlusIcon />
      </AriaButton>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            {({ close }) => (
              <div className="flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-2">
                  {foods?.rows.map((food) => (
                    <div
                      key={food.id}
                      className="flex items-center justify-between"
                    >
                      <p className="font-medium">{food.name}</p>
                      <Group className="flex items-center justify-end gap-x-2">
                        <UpdateFood food={food} />
                        <CreateServing
                          dailyLogDate={dailyLogDate}
                          meal={meal}
                          foodId={food.id}
                        />
                      </Group>
                    </div>
                  ))}
                </div>
                <CreateFood />
              </div>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
