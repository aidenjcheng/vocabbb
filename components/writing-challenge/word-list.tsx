import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="md:w-64 space-y-4">
      <div className="flex flex-col gap-2">
        {words.map(({ word, definition }) => (
          <TooltipProvider key={word}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center justify-between p-2 rounded-md ${
                    isWordUsed(word) ? "bg-green-50" : "bg-muted"
                  }`}
                >
                  <span>{word}</span>
                  {isWordUsed(word) && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
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
