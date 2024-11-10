import * as Aria from "react-aria-components";

const Dialog = ({ ...props }: Aria.DialogProps) => {
  return <Aria.Dialog {...props} />;
};

const DialogTrigger = ({ ...props }: Aria.DialogTriggerProps) => {
  return <Aria.DialogTrigger {...props} />;
};

export { Dialog, DialogTrigger };
