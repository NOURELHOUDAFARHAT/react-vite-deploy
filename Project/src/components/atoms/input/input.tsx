import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';



const inputVariants = cva(
  ' custom-input rounded-lg border-[1px] dark:border-sidedark  bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-sidedark dark:text-white dark:focus:border-primary',
  {
    variants: {},
    defaultVariants: {},
  }
);

const textareaVariants = cva(
  'w-full rounded-lg border-[1.5px] border-strokedark bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary',
  {
    variants: {},
    defaultVariants: {},
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        {...props}
        ref={ref}
        className={cn(inputVariants({ className }))}
      />
    );
  }
);

Input.displayName = 'Input';

// Customized TimeInput component with custom dropdown
const TimeInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        {...props}
        ref={ref}
        className={cn(
          'rounded-lg border-[1px] w-full  bg-white py-3 px-5  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-sidedark dark:text-white dark:focus:border-primary',
          className
        )}
      />
    );
  }
);

TimeInput.displayName = 'TimeInput';

export { Input, TimeInput };
