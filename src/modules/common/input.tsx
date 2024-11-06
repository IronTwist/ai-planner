'use client';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ value, ...props }: InputProps) => {
  return (
    <div className='flex w-full bg-blue-300 text-black'>
      <input className='w-full p-6' value={value} {...props} />
    </div>
  );
};
