"use client";

import type React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import WordList from "./word-list";
import type { WordType } from "../writing-challenge/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Copy, DownloadIcon, SidebarIcon } from "lucide-react";
import { toast } from "sonner";
import { updateWritingSession } from "@/components/writing/actions";
import { redirect } from "next/navigation";
import debounce from "lodash/debounce";

type FontStyle = "sans" | "serif" | "mono";
interface WritingInterfaceProps {
  timeRemaining: number;
  text: string;
  requiredWords: WordType[];
  sessionId: string;
  initialText: string;
}

export default function WritingInterface({
  timeRemaining: initialTimeRemaining,
  text,
  requiredWords,
  sessionId,
  initialText,
}: WritingInterfaceProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [fontStyle, setFontStyle] = useState<FontStyle>("sans");
  const [open, setOpen] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining);
  const [currentText, setCurrentText] = useState(text);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_TIMEOUT = 10000; // 10 seconds in milliseconds

  const debouncedFn = useRef(
    debounce(async (text: string) => {
      await updateWritingSession(sessionId, { text });
    }, 500),
  ).current;

  const handleTimeout = useCallback(async () => {
    // Clear any pending debounced updates
    debouncedFn.cancel();
    // Ensure the final text is saved
    await updateWritingSession(sessionId, { text: currentText });
    redirect(`/writing/${sessionId}?stopped=true`);
  }, [sessionId, currentText, debouncedFn]);

  // Reset inactivity timer whenever user types
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(handleTimeout, INACTIVITY_TIMEOUT);
  }, [handleTimeout]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, handleTimeout]);

  // Focus textarea and place cursor at the end when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        initialText.length,
        initialText.length,
      );
    }
    // Start initial inactivity timer
    resetInactivityTimer();
  }, [initialText, resetInactivityTimer]);

  // Use inline function to fix the unknown dependencies warning
  const handleTextChange = useCallback(
    async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      setCurrentText(newText);
      resetInactivityTimer();
      debouncedFn(newText);
    },
    [resetInactivityTimer, debouncedFn],
  );

  const getFontClass = (style: string) => {
    switch (style) {
      case "serif":
        return "font-serif";
      case "mono":
        return "font-mono";
      default:
        return "";
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    toast.success("Text copied to clipboard");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([currentText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "writing.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("File downloaded successfully");
  };

  const wordCount = currentText
    .trim()
    .split(/\s+/)
    .filter((word: string) => word.length > 0).length;
  const charCount = currentText.length;

  return (
    <div className="flex flex-col h-full justify-between pb-3 box-border">
      <div
        className="flex flex-col md:flex-row gap-4 relative mt-2  mx-auto w-full h-full data-[open=true]:gap-2  "
        data-open={open}
      >
        <div className=" ml-20 w-full">
          <div className="flex flex-col grow">
            <Textarea
              ref={textareaRef}
              value={currentText}
              onChange={handleTextChange}
              placeholder="Start writing here..."
              className={`min-h-[400px] grow resize-none border-none outline-none shadow-none! ${getFontClass(fontStyle)} w-full transition-all duration-200 delay-100 ease-out`}
              focus={false}
            />
          </div>
        </div>
        <WordList words={requiredWords} text={currentText} open={open} />
      </div>

      <div className="px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NumberFlowGroup>
            <div
              style={
                { fontVariantNumeric: "tabular-nums" } as React.CSSProperties
              }
              className="text-xs flex items-baseline group text-muted-foreground w-fit"
            >
              {timeRemaining >= 3600 && (
                <NumberFlow
                  trend={-1}
                  value={Math.floor(timeRemaining / 3600)}
                  format={{ minimumIntegerDigits: 2 }}
                  className="group-hover:text-foreground transition-colors duration-200 ease-out"
                />
              )}
              {timeRemaining >= 3600 && (
                <NumberFlow
                  prefix=":"
                  trend={-1}
                  value={Math.floor((timeRemaining % 3600) / 60)}
                  digits={{ 1: { max: 5 } }}
                  format={{ minimumIntegerDigits: 2 }}
                  className="group-hover:text-foreground transition-colors duration-200 ease-out"
                />
              )}
              {timeRemaining < 3600 && (
                <NumberFlow
                  trend={-1}
                  value={Math.floor(timeRemaining / 60)}
                  format={{ minimumIntegerDigits: 2 }}
                  className="group-hover:text-foreground transition-colors duration-200 ease-out"
                />
              )}
              <NumberFlow
                prefix=":"
                trend={-1}
                value={timeRemaining % 60}
                digits={{ 1: { max: 5 } }}
                format={{ minimumIntegerDigits: 2 }}
                className="group-hover:text-foreground transition-colors duration-200 ease-out"
              />
            </div>
          </NumberFlowGroup>
          <Select
            value={fontStyle}
            onValueChange={(value) => setFontStyle(value as FontStyle)}
          >
            <SelectTrigger className="w-fit h-5 rounded-sm px-1 border-none shadow-none text-xs text-muted-foreground">
              <SelectValue placeholder="Font style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans" className="text-sm">
                Sans-serif
              </SelectItem>
              <SelectItem value="serif" className="text-sm">
                Serif
              </SelectItem>
              <SelectItem value="mono" className="text-sm">
                Monospace
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleCopy}
            variant={"ghost"}
            size={"icon"}
            className="hover:text-foreground text-muted-foreground size-5 p-0.5 rounded-sm"
          >
            <Copy className="!size-4" />
          </Button>
          <Button
            onClick={handleDownload}
            variant={"ghost"}
            size={"icon"}
            className="hover:text-foreground text-muted-foreground size-5 rounded-sm"
          >
            <DownloadIcon className="!size-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            {wordCount} words • {charCount} characters
          </div>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:text-foreground text-muted-foreground size-5 p-0.5 rounded-sm"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <SidebarIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
