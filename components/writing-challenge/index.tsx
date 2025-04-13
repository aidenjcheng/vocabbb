"use client";

import { useState, useEffect } from "react";
import { WRITING_PROMPTS, SOPHISTICATED_WORDS } from "@/data/prompts";
import ChallengeSetup from "../writing-setup/challenge-setup";
import WordReview from "../writing-setup/word-review";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import type { TimerOption, WordWithExampleType } from "./types";
import { generateExampleSentence } from "@/data/prompts";

import { createWritingSession } from "@/app/actions";

export default function WritingChallenge({ uuid }: { uuid: string }) {
  const [selectedTime, setSelectedTime] = useState<TimerOption>(5);
  const [customTime, setCustomTime] = useState<number>(30);
  const [prompt, setPrompt] = useState<string>("");
  const [requiredWords, setRequiredWords] = useState<
    typeof SOPHISTICATED_WORDS
  >([]);
  const [wordsWithExamples, setWordsWithExamples] = useState<
    WordWithExampleType[]
  >([]);
  const [showWordReview, setShowWordReview] = useState<boolean>(false);

  const generateRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * WRITING_PROMPTS.length);
    setPrompt(WRITING_PROMPTS[randomIndex]);
  };

  // Initialize writing prompt
  useEffect(() => {
    generateRandomPrompt();
  }, []);

  // Set up required words based on timer length
  const prepareRequiredWords = () => {
    const timeInMinutes = selectedTime !== "custom" ? selectedTime : customTime;
    const wordCount = Math.ceil((1 / 3) * timeInMinutes);
    const shuffled = [...SOPHISTICATED_WORDS].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, wordCount);
    setRequiredWords(selectedWords);

    // Create words with examples
    const withExamples = selectedWords.map((word) => ({
      ...word,
      exampleSentence: generateExampleSentence(word.word, word.definition),
    }));
    setWordsWithExamples(withExamples);
  };

  const CreateSession = async () => {
    await createWritingSession({
      selected_time: selectedTime == "custom" ? customTime : selectedTime,
      prompt: prompt,
      required_words: requiredWords,
      user_id: uuid,
    });
  };

  const startReview = () => {
    prepareRequiredWords();
    setShowWordReview(true);
  };

  const backToSetup = () => {
    setShowWordReview(false);
  };

  return (
    <div
      className="w-full mx-auto pt-10 flex flex-col"
      style={{ height: "100vh" }}
    >
      <ChallengeSetup
        selectedTime={selectedTime}
        customTime={customTime}
        prompt={prompt}
        onTimeChange={setSelectedTime}
        onCustomTimeChange={setCustomTime}
        onStart={startReview}
        generateRandomPrompt={generateRandomPrompt}
      />

      <Dialog open={showWordReview} onOpenChange={setShowWordReview}>
        <DialogTitle hidden>Vocab Review</DialogTitle>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <WordReview
            words={wordsWithExamples}
            onStartWritingAction={CreateSession}
            onBackAction={backToSetup}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
