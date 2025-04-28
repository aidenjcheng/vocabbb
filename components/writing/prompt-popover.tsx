import React from "react";
import { Textarea } from "../ui/textarea";

interface PromptPopoverProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

export default function PromptPopover({
  prompt,
  setPrompt,
}: PromptPopoverProps) {
  return (
    <Textarea
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      className="mb-2 !shadow-none !ring-0 border-none !text-2xl font-medium"
    />
  );
}
