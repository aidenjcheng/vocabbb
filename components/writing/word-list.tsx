import {
  Tooltip,
  // TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check } from "lucide-react";
import type { WordType } from "../writing-challenge/types";

interface WordListProps {
  words: WordType[];
  text: string;
  open: boolean;
}

export default function WordList({ words, text, open }: WordListProps) {
  // Check if a word is used in the current text
  const isWordUsed = (word: string): boolean => {
    return text.toLowerCase().includes(word.toLowerCase());
  };

  return (
    <div
      className="space-y-4    border-black/10 data-[open=true]:border-l data-[open=true]:md:w-64 data-[open=true]:px-5 data-[open=true]:py-3 w-0 transition-all duration-200 delay-100 box-border overflow-hidden mb-10"
      data-open={open}
    >
      <div className="flex flex-col gap-2 text-sm ">
        <p className="font-medium">Words checklist</p>
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
                  <div className="flex flex-col ">
                    <span>{word}</span>
                    <span className=" text-muted-foreground text-[13px]">
                      {definition}
                    </span>
                  </div>
                  {isWordUsed(word) && (
                    <Check
                      className="h-4 w-4 text-white stroke-[2.5] p-0.5 bg-green-500 rounded-full shrink-0"
                      strokeWidth={5}
                    />
                  )}
                </div>
              </TooltipTrigger>
              {/* <TooltipContent side="left" className="max-w-xs">
                <p>{definition}</p>
              </TooltipContent> */}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
