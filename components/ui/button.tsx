import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all! focus-visible:outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50  gap-1 hover:scale-[1.01] active:scale-[0.97] scale-100 active:opacity-60",
  {
    variants: {
      variant: {
        default:
          "bg-linear-to-b from-[rgb(28,_28,_28)] to-primary text-primary-foreground hover:bg-[rgb(32,_32,_32)] shadow-[inset_0_0_1px_1px_hsla(0,0%,100%,0.08),0_1px_1.5px_0_rgba(0,0,0,0.32)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[inset_0_0_1px_1px_hsla(0,0%,100%,0.08),0_1px_1.5px_0_rgba(0,0,0,0.32),0_0_0_0.5px_#ed4528]",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        contrast: "bg-contrast text-primary-foreground hover:bg-contrast-fade",
      },
      size: {
        default:
          " px-4 py-2  rounded-[10px] min-w-48 desktop:w-auto desktop:min-w-[248px]",
        sm: "h-8 rounded-lg px-3 ",
        lg: "h-11 rounded-md px-8",
        xs: "p-[0_8px]  rounded-[5px] text-xs h-6",
        wide: "px-2 py-1 text-[13px] gap-1 rounded-md",
        icon: "h-7 w-7",
      },
      wide: {
        true: "relative isolate inline-flex justify-center items-center w-full px-3 py-1.5 border border-[hsla(217,91%,59%,1)]! rounded-md cursor-pointer select-none outline-hidden transition-all duration-100 bg-[hsla(217,91%,59%,1)] text-primary-foreground text-[0.8125rem] leading-[1.38462] font-medium shadow-[0px_0px_0px_1px_rgb(55,128,246),_0px_1px_1px_0px_rgba(255,255,255,0.07)_inset,_0px_2px_3px_0px_rgba(34,42,53,0.2),_0px_1px_1px_0px_rgba(0,0,0,0.24)] before:absolute before:inset-0 before:z-[-1] before:opacity-100 before:transition-all before:duration-100 before:rounded-inherit before:bg-linear-to-b before:from-[rgba(255,255,255,0.11)] before:to-transparent bg-none! hover:bg-[hsla(217,91%,59%,0.85)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  toolTip?: boolean;
  toolTipComponent?: React.ReactNode;
  wide?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      toolTip = false,
      toolTipComponent,
      wide = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    if (toolTip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Comp
                className={cn(
                  buttonVariants({ variant, size, className, wide }),
                )}
                ref={ref}
                {...props}
              />
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              {toolTipComponent ? (
                <div className="flex items-center">{toolTipComponent}</div>
              ) : (
                <p>no tooltip component provided</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className, wide }))}
        ref={ref}
        {...props}
      >
        {props.children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
