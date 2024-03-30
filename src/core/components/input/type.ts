type InputType = 'text' | 'password' | 'number' | 'email';

export type BaseInput = {
  type: InputType;
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
};
