export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ value, ...props }: InputProps) => {
  return <input value={value} {...props} />;
};
