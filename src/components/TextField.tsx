import * as Aria from "react-aria-components";

const TextField = ({ ...props }: Aria.TextFieldProps) => {
  return <Aria.TextField {...props} />;
};

const Label = ({ ...props }: Aria.LabelProps) => {
  return <Aria.Label {...props} />;
};

const Input = ({ ...props }: Aria.InputProps) => {
  return <Aria.Input {...props} />;
};

const FieldError = ({ ...props }: Aria.FieldErrorProps) => {
  return <Aria.FieldError {...props} />;
};

export { FieldError, Input, Label, TextField };
