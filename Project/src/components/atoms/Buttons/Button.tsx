import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "inline-flex items-center justify-center text-center rounded-md font-medium hover:bg-opacity-90 ",
  {
    variants: {
      text: {
        default: "dark:text-white text-sidedark ",
        danger: "text-danger",
        dark: "dark:text-sidedark text-black",
        light:"dark:text-white text-white"
      },
      bg: {
        default: "bg-primary",
        gray: "bg-strokdark border border-boxdark",
        transparent: "bg-transparent ",
        card: "dark:bg-strokedark border border-2 border-dashed dark:border-white border-black bg-whiten",
        black: "dark:bg-sidedark bg-gray",
        gost: "dark:bg-primary-2  bg-white border border-black dark:border-primary-2",
        stroke:"dark:bg-strokedark bg-form-strokedark ",
      },
      size: {
        default: "py-4 px-10 lg:px-8 xl:px-10 ",
        small: "py-2 w-15 lg:px-4 xl:px-2",
        lg: "py-3 px-4 lg:px-6 xl:px-4",
        card: "py-17  w-full h-64 rounded-xl ",
        md:"w-full px-4 py-2 ",
        notifi: "w-full  rounded-lg py-1 ",
      
      },
    },
    defaultVariants: {
      bg: "default",
      text: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, text, bg, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ className, bg, text, size }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
