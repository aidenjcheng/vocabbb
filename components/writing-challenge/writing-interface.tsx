"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Clock, Square } from "lucide-react";
import WordList from "./word-list";
import InactivityWarning from "./inactivity-warning";
import type { WordType } from "./types";

interface WritingInterfaceProps {
  timeRemaining: number;
  text: string;
  requiredWords: WordType[];
  onTextChange: (text: string) => void;
  onStop: () => void;
  onTimeout: () => void;
  initialText: string;
}

export default function WritingInterface({
  timeRemaining,
  text,
  requiredWords,
  onTextChange,
  onStop,
  onTimeout,
  initialText,
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
        if (prev >= 5000) {
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

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const getProgressPercentage = (): number => {
    return (timeRemaining / (timeRemaining + inactivitySeconds)) * 100 || 0;
  };

  const getTimerColor = (): string => {
    if (timeRemaining <= 30) return "text-red-500";
    if (timeRemaining <= 60) return "text-orange-500";
    return "text-primary";
  };

  return (
    <>
      <Progress value={getProgressPercentage()} className="  rounded-none" />

      {/* <InactivityWarning inactivitySeconds={inactivitySeconds} /> */}

      <div className="flex flex-col md:flex-row gap-4 relative">
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder="Start writing here..."
          className="min-h-[400px] flex-grow resize-none !border-non !outline-none !shadow-none"
          focus={false}
        />

        <WordList words={requiredWords} text={text} />
      </div>
    </>
  );
}
