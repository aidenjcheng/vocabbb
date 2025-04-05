import * as React from "react";

import { cn } from "@/lib/utils";
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  focus?: boolean;
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ focus = true, className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md   bg-background px-3 py-2 text-base  placeholder:text-muted-foreground outline-hidden",
          focus &&
            " focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-input border ring-offset-background",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
