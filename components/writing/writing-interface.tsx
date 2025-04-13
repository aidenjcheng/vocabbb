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
import debounce from "lodash/debounce";
import InactivityWarning from "./inactivity-warning";
import WritingCompleteDialog from "./writing-complete-dialog";

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
  // Track inactivity seconds for the warning display
  const [inactivitySeconds, setInactivitySeconds] = useState(0);
  // If session already has text, it means it was stopped previously
  const [isStopped, setIsStopped] = useState(text !== initialText);

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
    // Instead of redirecting, set state to show dialog
    setIsStopped(true);
  }, [sessionId, currentText, debouncedFn]);

  // Reset inactivity timer whenever user types
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    // Reset the inactivity seconds counter when user interacts
    setInactivitySeconds(0);
    inactivityTimerRef.current = setTimeout(handleTimeout, INACTIVITY_TIMEOUT);
  }, [handleTimeout]);

  // Cleanup is now handled in the inactivity timer effect

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

  // Helper function to get cookie value
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)"),
    );
    return match ? match[2] : null;
  };

  // Read sidebar state from cookie on mount
  useEffect(() => {
    const sidebarCookie = getCookie("sidebarOpen");
    if (sidebarCookie === "true") {
      setOpen(true);
    }
  }, []);

  // Focus textarea and place cursor at the end when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        initialText.length,
        initialText.length,
      );
    }
  }, [initialText]);

  // Separate effect for inactivity timer
  useEffect(() => {
    // Only start the inactivity timer if the session isn't already stopped
    if (!isStopped) {
      resetInactivityTimer();
    }

    // Cleanup on unmount
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [resetInactivityTimer, isStopped]);

  // Effect to increment inactivity seconds
  useEffect(() => {
    if (isStopped) return;

    const inactivityInterval = setInterval(() => {
      setInactivitySeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(inactivityInterval);
  }, [isStopped]);

  // Use inline function to fix the unknown dependencies warning
  const handleTextChange = useCallback(
    async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      const selectionStart = e.target.selectionStart;
      const selectionEnd = e.target.selectionEnd;

      setCurrentText(newText);
      resetInactivityTimer();
      debouncedFn(newText);

      // Preserve cursor position after React re-renders
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = selectionStart;
          textareaRef.current.selectionEnd = selectionEnd;
        }
      });
    },
    [resetInactivityTimer, debouncedFn, textareaRef],
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

  // These functions are now handled in the WritingCompleteDialog component

  const wordCount = currentText
    .trim()
    .split(/\s+/)
    .filter((word: string) => word.length > 0).length;
  const charCount = currentText.length;

  return (
    <div className="flex flex-col h-screen justify-between pb-3 box-border">
      {!isStopped && (
        <InactivityWarning inactivitySeconds={inactivitySeconds} />
      )}
      <div
        className="flex flex-col md:flex-row gap-4 relative mt-2  mx-auto w-full h-[90%] data-[open=true]:gap-2 flex-1"
        data-open={open}
      >
        <div className="ml-20 w-full">
          <div className="flex flex-col grow">
            <Textarea
              ref={textareaRef}
              value={currentText}
              onChange={handleTextChange}
              placeholder="Start writing here..."
              className={`min-h-[400px] grow resize-none border-none outline-none shadow-none! ${getFontClass(fontStyle)} w-full transition-all duration-200 delay-100 ease-out`}
              focus={false}
              disabled={isStopped}
            />
          </div>
        </div>
        <WordList words={requiredWords} text={currentText} open={open} />
      </div>

      <div className="px-4 flex items-center justify-between flex-[0]">
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
            disabled={isStopped}
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
              const newState = !open;
              setOpen(newState);
              // Save to cookie
              document.cookie = `sidebarOpen=${newState ? "true" : "false"}; path=/; max-age=31536000; SameSite=Strict`;
            }}
            disabled={isStopped}
          >
            <SidebarIcon className="size-4" />
          </Button>
        </div>
      </div>

      {/* Stopped Writing Dialog */}
      <WritingCompleteDialog
        open={isStopped}
        onOpenChange={setIsStopped}
        text={currentText}
        sessionId={sessionId}
      />
    </div>
  );
}
