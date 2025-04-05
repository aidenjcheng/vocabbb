import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { WordWithExampleType } from "./types";

interface WordReviewProps {
  words: WordWithExampleType[];
  onStartWriting: () => void;
  onBackAction: () => void;
}

export default function WordReview({
  words,
  onStartWriting,
  onBackAction,
}: WordReviewProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const currentWord = words[currentWordIndex];

  const goToNextWord = () => {
    setCurrentWordIndex((prev) => (prev === words.length - 1 ? 0 : prev + 1));
  };

  const goToPrevWord = () => {
    setCurrentWordIndex((prev) => (prev === 0 ? words.length - 1 : prev - 1));
  };

  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-col justify-center items-center gap-6">
        <div className="flex justify-between items-center w-full">
          <Button variant="outline" size="icon" onClick={goToPrevWord}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <Badge variant="outline" className="mb-2">
              {currentWordIndex + 1} of {words.length}
            </Badge>
            <h3 className="text-2xl font-bold">{currentWord.word}</h3>
          </div>
          <Button variant="outline" size="icon" onClick={goToNextWord}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-muted p-4 rounded-md w-full">
          <h4 className="text-sm font-medium text-muted-foreground mb-1">
            Definition:
          </h4>
          <p className="text-lg">{currentWord.definition}</p>
        </div>

        <div className="bg-muted/50 p-4 rounded-md border w-full">
          <h4 className="text-sm font-medium text-muted-foreground mb-1">
            Example sentence:
          </h4>
          <p className="text-lg italic">{currentWord.exampleSentence}</p>
        </div>

        <div className="grid grid-cols-5 gap-2 mt-6 w-full">
          {words.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full ${index === currentWordIndex ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-4 w-full ">
          {words.map((word, index) => (
            <Badge
              key={word.word}
              variant={index === currentWordIndex ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setCurrentWordIndex(index)}
            >
              {word.word}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6 w-full">
        <Button
          variant="outline"
          onClick={onBackAction}
          className="flex-1 sm:flex-none"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={onStartWriting} className="flex-1 sm:flex-none">
          Start Writing
        </Button>
      </div>
    </div>
  );
}
