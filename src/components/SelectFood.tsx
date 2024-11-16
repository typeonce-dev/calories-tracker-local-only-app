import { ListPlusIcon } from "lucide-react";
import { Button } from "react-aria-components";
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
      <Button>
        <ListPlusIcon />
      </Button>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            {({ close }) => (
              <div>
                <CreateFood />
                <div className="flex flex-col">
                  {foods?.rows.map((food) => (
                    <div key={food.id} className="flex items-center gap-x-4">
                      <p>{food.name}</p>
                      <UpdateFood food={food} />
                      <CreateServing
                        dailyLogDate={dailyLogDate}
                        meal={meal}
                        foodId={food.id}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
