import * as Aria from "react-aria-components";
import { cn } from "~/utils";

const Dialog = ({ className, ...props }: Aria.DialogProps) => {
  return (
    <Aria.Dialog
      className={cn(
        "w-screen max-h-[calc(100dvh-6rem)] overflow-y-auto p-6",
        className
      )}
      {...props}
    />
  );
};

const DialogTrigger = ({ ...props }: Aria.DialogTriggerProps) => {
  return <Aria.DialogTrigger {...props} />;
};

export { Dialog, DialogTrigger };
