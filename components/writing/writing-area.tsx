import { Textarea } from "@/components/ui/textarea";
import React from "react";

type FontStyle = "sans" | "serif" | "mono";

interface WritingAreaProps {
  currentText: string;
  setCurrentText: (t: string) => void;
  handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  fontStyle: FontStyle;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  isStopped: boolean;
}

export default function WritingArea({
  currentText,
  handleTextChange,
  fontStyle,
  textareaRef,
  isStopped,
}: WritingAreaProps) {
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
  return (
    <Textarea
      ref={textareaRef}
      value={currentText}
      placeholder="Write about anything!"
      onChange={handleTextChange}
      className={`min-h-[400px] grow resize-none border-none outline-none shadow-none! ${getFontClass(
        fontStyle
      )} w-full transition-all duration-200 delay-100 ease-out`}
      focus={false}
      disabled={isStopped}
    />
  );
}
