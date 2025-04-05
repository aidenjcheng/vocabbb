import type { SOPHISTICATED_WORDS } from "@/data/prompts";

export type TimerOption = 5 | 10 | 15 | 20 | 25 | "custom";

export type WordType = (typeof SOPHISTICATED_WORDS)[0];

export type WordWithExampleType = WordType & {
  exampleSentence: string;
};

export type AnalysisResultType = {
  usedWords: string[];
  missingWords: string[];
  correctUsage: string[];
  incorrectUsage: string[];
};
