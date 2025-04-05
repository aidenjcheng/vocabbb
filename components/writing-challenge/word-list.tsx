import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2 } from "lucide-react";
import type { WordType } from "./types";

interface WordListProps {
  words: WordType[];
  text: string;
}

export default function WordList({ words, text }: WordListProps) {
  // Check if a word is used in the current text
  const isWordUsed = (word: string): boolean => {
    return text.toLowerCase().includes(word.toLowerCase());
  };

  return (
    <div className="md:w-80 space-y-4 bg-muted/80  px-5 py-3 rounded-lg shadow-sm">
      <div className="flex flex-col gap-2 text-sm">
        Words checklist
        {words.map(({ word, definition }) => (
          <TooltipProvider key={word}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center justify-between px-2 py-1 rounded-md border text-sm transition-colors ease-out duration-200 ${
                    isWordUsed(word)
                      ? "bg-green-50 border-transparent text-green-500"
                      : "bg-background "
                  }`}
                >
                  <span>{word}</span>
                  {isWordUsed(word) && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 stroke-[2.5]" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p>{definition}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
