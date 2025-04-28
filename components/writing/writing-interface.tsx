"use client";

import type React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
// import WordList from "./word-list";
import { toast } from "sonner";
import InactivityWarning from "./inactivity-warning";
import WritingCompleteDialog from "./writing-complete-dialog";
import PromptPopover from "./prompt-popover";
import WritingToolbar from "./writing-toolbar";
import WritingArea from "./writing-area";

type FontStyle = "sans" | "serif" | "mono";
interface WritingInterfaceProps {
  // requiredWords: WordType[];
  initialPrompt?: string;
  initialTimer?: number;
}
//hi

//awesome
export default function WritingInterface({
  // requiredWords,
  initialPrompt = "Write about anything!",
  initialTimer = 300,
}: WritingInterfaceProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [fontStyle, setFontStyle] = useState<FontStyle>("sans");
  const [timeRemaining, setTimeRemaining] = useState(initialTimer);
  const [currentText, setCurrentText] = useState("");
  const [prompt, setPrompt] = useState(initialPrompt);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_TIMEOUT = 10000;
  const [inactivitySeconds, setInactivitySeconds] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const timerOptions = [60, 120, 300, 600, 900, 1800];
  const [customTimer, setCustomTimer] = useState(0);
  const [inactivityTimeoutEnabled, setInactivityTimeoutEnabled] =
    useState(true);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [timerPaused, setTimerPaused] = useState(true);

  const handleTimeout = useCallback(() => {
    setIsStopped(true);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    setInactivitySeconds(0);
    inactivityTimerRef.current = setTimeout(handleTimeout, INACTIVITY_TIMEOUT);
  }, [handleTimeout]);

  useEffect(() => {
    if (timeRemaining <= 0 || timerPaused) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, timerPaused]);

  useEffect(() => {
    if (!inactivityTimeoutEnabled || !hasStartedTyping) return;
    if (!isStopped) {
      resetInactivityTimer();
    }
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [
    resetInactivityTimer,
    isStopped,
    inactivityTimeoutEnabled,
    hasStartedTyping,
  ]);

  useEffect(() => {
    if (isStopped || !inactivityTimeoutEnabled || !hasStartedTyping) return;
    const inactivityInterval = setInterval(() => {
      setInactivitySeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(inactivityInterval);
  }, [isStopped, inactivityTimeoutEnabled, hasStartedTyping]);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      const selectionStart = e.target.selectionStart;
      const selectionEnd = e.target.selectionEnd;
      setCurrentText(newText);
      if (!hasStartedTyping && newText.trim().length > 0) {
        setHasStartedTyping(true);
        setTimerPaused(false);
      }
      if (inactivityTimeoutEnabled && hasStartedTyping) {
        resetInactivityTimer();
      }
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = selectionStart;
          textareaRef.current.selectionEnd = selectionEnd;
        }
      });
    },
    [
      resetInactivityTimer,
      textareaRef,
      inactivityTimeoutEnabled,
      hasStartedTyping,
    ]
  );

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

  const handleTimerClick = () => {
    if (timeRemaining > 0) {
      setTimerPaused((prev) => !prev);
    }
  };

  const timerDisplay = (
    <NumberFlowGroup>
      <button
        type="button"
        onClick={handleTimerClick}
        className={`text-xs flex items-baseline group text-muted-foreground w-fit select-none px-1 rounded transition-colors duration-200 ${
          timerPaused ? "bg-accent" : "hover:bg-accent hover:text-foreground"
        }`}
        style={{ fontVariantNumeric: "tabular-nums" } as React.CSSProperties}
        aria-label={timerPaused ? "Resume timer" : "Pause timer"}
      >
        {timeRemaining >= 3600 && (
          <NumberFlow
            trend={-1}
            value={Math.floor(timeRemaining / 3600)}
            format={{ minimumIntegerDigits: 2 }}
            className="transition-colors duration-200 ease-out"
          />
        )}
        {timeRemaining >= 3600 && (
          <NumberFlow
            prefix=":"
            trend={-1}
            value={Math.floor((timeRemaining % 3600) / 60)}
            digits={{ 1: { max: 5 } }}
            format={{ minimumIntegerDigits: 2 }}
            className="transition-colors duration-200 ease-out"
          />
        )}
        {timeRemaining < 3600 && (
          <NumberFlow
            trend={-1}
            value={Math.floor(timeRemaining / 60)}
            format={{ minimumIntegerDigits: 2 }}
            className="transition-colors duration-200 ease-out"
          />
        )}
        <NumberFlow
          prefix=":"
          trend={-1}
          value={timeRemaining % 60}
          digits={{ 1: { max: 5 } }}
          format={{ minimumIntegerDigits: 2 }}
          className="transition-colors duration-200 ease-out"
        />
        <span className="ml-1 text-[10px] font-semibold">
          {timerPaused ? "⏸" : ""}
        </span>
      </button>
    </NumberFlowGroup>
  );

  return (
    <div className="flex flex-col h-screen justify-between pb-3 box-border">
      {!isStopped && inactivityTimeoutEnabled && hasStartedTyping && (
        <InactivityWarning inactivitySeconds={inactivitySeconds} />
      )}
      <div className="flex flex-col md:flex-row gap-4 relative mt-2 mx-auto w-full h-[90%]flex-1">
        <div className="mx-20 w-full">
          <div className="flex flex-col grow gap-2">
            <PromptPopover prompt={prompt} setPrompt={setPrompt} />
            <WritingArea
              currentText={currentText}
              setCurrentText={setCurrentText}
              handleTextChange={handleTextChange}
              fontStyle={fontStyle}
              textareaRef={textareaRef}
              isStopped={isStopped}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <WritingToolbar
          fontStyle={fontStyle}
          setFontStyle={setFontStyle}
          isStopped={isStopped}
          handleCopy={handleCopy}
          handleDownload={handleDownload}
          wordCount={wordCount}
          charCount={charCount}
          timerDisplay={timerDisplay}
          inactivityTimeoutEnabled={inactivityTimeoutEnabled}
          setInactivityTimeoutEnabled={setInactivityTimeoutEnabled}
          timeRemaining={timeRemaining}
          setTimeRemaining={setTimeRemaining}
          timerOptions={timerOptions}
          customTimer={customTimer}
          setCustomTimer={setCustomTimer}
        />
      </div>
      <WritingCompleteDialog
        open={isStopped}
        onOpenChange={setIsStopped}
        text={currentText}
      />
    </div>
  );
}
