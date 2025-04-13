export type TimerOption = 5 | 10 | 15 | 20 | 25 | "custom";

export type WordType = { word: string; definition: string };

export type WordWithExampleType = WordType & {
  exampleSentence: string;
};

export type AnalysisResultType = {
  usedWords: string[];
  missingWords: string[];
  correctUsage: string[];
  incorrectUsage: string[];
};
