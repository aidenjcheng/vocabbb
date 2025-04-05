"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import WordList from "./word-list";
import InactivityWarning from "./inactivity-warning";
import type { WordType } from "./types";

const inactivityTime = 50000;
interface WritingInterfaceProps {
  timeRemaining: number;
  text: string;
  requiredWords: WordType[];
  onTextChange: (text: string) => void;
  onStop: () => void;
  onTimeout: () => void;
  initialText: string;
  selectedTime: number;
}

export default function WritingInterface({
  timeRemaining,
  text,
  requiredWords,
  onTextChange,
  onStop,
  onTimeout,
  initialText,
  selectedTime,
}: WritingInterfaceProps) {
  const [inactivitySeconds, setInactivitySeconds] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Inactivity tracking
  useEffect(() => {
    // Start the inactivity tracking interval
    const interval = setInterval(() => {
      setInactivitySeconds((prev) => {
        // If we reach 10 seconds, trigger timeout
        if (prev >= inactivityTime) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [onTimeout]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    onTextChange(newText);
    // Reset inactivity timer
    setInactivitySeconds(0);
  };

  // Calculate progress percentage
  const getProgressPercentage = (): number => {
    return (timeRemaining / (selectedTime * 60)) * 100 || 0;
  };

  return (
    <>
      <Progress value={getProgressPercentage()} className="  rounded-none" />

      {/* <InactivityWarning inactivitySeconds={inactivitySeconds} /> */}

      <div className="flex flex-col md:flex-row gap-4 relative mt-2">
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder="Start writing here..."
          className="min-h-[400px] grow resize-none border-non! outline-hidden! shadow-none!"
          focus={false}
        />

        <WordList words={requiredWords} text={text} />
      </div>
    </>
  );
}
