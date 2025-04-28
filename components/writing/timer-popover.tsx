import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

interface TimerPopoverProps {
  timeRemaining: number;
  setTimeRemaining: (t: number) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  customTimer: number;
  setCustomTimer: (t: number) => void;
  timerOptions: number[];
}

export default function TimerPopover({
  timeRemaining,
  setTimeRemaining,
  open,
  setOpen,
  customTimer,
  setCustomTimer,
  timerOptions,
}: TimerPopoverProps) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="mb-2 w-fit">
          Timer
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          {timerOptions.map((opt) => (
            <Button
              key={opt}
              variant={timeRemaining === opt ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setTimeRemaining(opt);
                setOpen(false);
              }}
            >
              {opt / 60} min
            </Button>
          ))}
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min={1}
              value={customTimer || ""}
              onChange={(e) => setCustomTimer(Number(e.target.value))}
              className="w-16"
            />
            <Button
              size="sm"
              onClick={() => {
                if (customTimer > 0) {
                  setTimeRemaining(customTimer);
                  setOpen(false);
                }
              }}
            >
              Set
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
