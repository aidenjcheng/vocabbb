"use client";

import { useState, useEffect } from "react";
import { WRITING_PROMPTS, SOPHISTICATED_WORDS } from "@/data/prompts";
import ChallengeSetup from "./challenge-setup";
import WordReview from "./word-review";
import WritingInterface from "./writing-interface";
import StoppedWritingScreen from "./stopped-writing-screen";
import AnalysisResults from "./analysis-results";
import { useToast } from "@/hooks/use-toast";
import { debounce } from "@/lib/utils";
import type {
  AnalysisResultType,
  TimerOption,
  WordWithExampleType,
} from "./types";

// Example sentences for each word (in a real app, these might come from an API)
const generateExampleSentence = (word: string, definition: string): string => {
  const exampleSentences: Record<string, string> = {
    Ephemeral:
      "The beauty of cherry blossoms is ephemeral, lasting only a few days each spring.",
    Surreptitious:
      "She cast a surreptitious glance at the confidential document on his desk.",
    Mellifluous:
      "The singer's mellifluous voice captivated the entire audience.",
    Ubiquitous: "Smartphones have become ubiquitous in modern society.",
    Pernicious: "The pernicious rumors damaged his reputation beyond repair.",
    Eloquent: "Her eloquent speech moved many in the audience to tears.",
    Fastidious:
      "The fastidious chef inspected every plate before it left the kitchen.",
    Capricious:
      "The capricious weather changed from sunshine to thunderstorms within minutes.",
    Diaphanous:
      "She wore a diaphanous gown that floated around her as she walked.",
    Serendipity:
      "By serendipity, she bumped into her old friend at the airport.",
    Quintessential:
      "The small café with checkered tablecloths was the quintessential Parisian experience.",
    Perspicacious:
      "The perspicacious detective noticed the subtle clue everyone else had missed.",
    Sycophant:
      "The CEO surrounded himself with sycophants who never challenged his ideas.",
    Obfuscate:
      "The politician tried to obfuscate the truth with complicated jargon.",
    Recalcitrant:
      "The recalcitrant child refused to eat his vegetables despite his parents' pleas.",
    Perfunctory:
      "He gave a perfunctory nod without really listening to what was said.",
    Insidious:
      "The insidious disease had spread throughout his body before any symptoms appeared.",
    Esoteric:
      "The professor's lecture on quantum physics was too esoteric for most students to understand.",
    Equivocal:
      "His equivocal response left us unsure about whether he would attend the event.",
    Ineffable: "The beauty of the sunset over the ocean was almost ineffable.",
  };

  // Return the predefined example or generate a generic one
  return (
    exampleSentences[word] ||
    `The word "${word}" means "${definition.toLowerCase()}".`
  );
};

export default function WritingChallenge() {
  const [selectedTime, setSelectedTime] = useState<TimerOption>(5);
  const [customTime, setCustomTime] = useState<number>(30);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [lastSavedText, setLastSavedText] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [requiredWords, setRequiredWords] = useState<
    typeof SOPHISTICATED_WORDS
  >([]);
  const [wordsWithExamples, setWordsWithExamples] = useState<
    WordWithExampleType[]
  >([]);
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResultType | null>(null);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [stoppedWriting, setStoppedWriting] = useState<boolean>(false);
  const [showWordReview, setShowWordReview] = useState<boolean>(false);
  const { toast } = useToast();
  function generateRandomPrompt() {
    const randomIndex = Math.floor(Math.random() * WRITING_PROMPTS.length);
    setPrompt(WRITING_PROMPTS[randomIndex]);
  }
  // Initialize writing prompt
  useEffect(() => {
    generateRandomPrompt();
  }, []);

  // Set up required words based on timer length
  const prepareRequiredWords = () => {
    const timeInMinutes = selectedTime != "custom" ? selectedTime : customTime;
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

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      setIsActive(false);
      analyzeText();
      setShowAnalysis(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  const startReview = () => {
    prepareRequiredWords();
    setShowWordReview(true);
  };

  const startWriting = () => {
    const minutes =
      typeof selectedTime === "number" ? selectedTime : customTime;
    setTimeRemaining(minutes * 60);
    setIsActive(true);
    setText(prompt); // Start with the prompt text
    setLastSavedText(prompt);
    setShowAnalysis(false);
    setAnalysisResult(null);
    setStoppedWriting(false);
    setShowWordReview(false);
  };

  const backToSetup = () => {
    setShowWordReview(false);
  };

  const stopTimer = () => {
    setIsActive(false);
    setStoppedWriting(true);
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    debouncedCheckDeletion(newText);
  };

  // Debounced function to check for large deletions
  const debouncedCheckDeletion = debounce((newText: string) => {
    if (lastSavedText && lastSavedText.length - newText.length > 50) {
      toast({
        title: "Large deletion detected!",
        description:
          "You deleted too many characters at once. Your work has been deleted.",
        variant: "destructive",
      });
      setText("");
    }
    setLastSavedText(newText);
  }, 500);

  // Mock analysis function (in a real app, this would call the Gemini API)
  const analyzeText = () => {
    // Simulate API call delay
    setTimeout(() => {
      const textLower = text.toLowerCase();
      const usedWords: string[] = [];
      const missingWords: string[] = [];
      const correctUsage: string[] = [];
      const incorrectUsage: string[] = [];

      requiredWords.forEach(({ word }) => {
        if (textLower.includes(word.toLowerCase())) {
          usedWords.push(word);

          // Random determination for demo purposes
          if (Math.random() > 0.3) {
            correctUsage.push(word);
          } else {
            incorrectUsage.push(word);
          }
        } else {
          missingWords.push(word);
        }
      });

      setAnalysisResult({
        usedWords,
        missingWords,
        correctUsage,
        incorrectUsage,
      });
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Your writing has been copied to your clipboard.",
    });
  };

  const resetChallenge = () => {
    setShowAnalysis(false);
    setStoppedWriting(false);
    setShowWordReview(false);
    setSelectedTime(5);
  };

  const handleTimeout = () => {
    setIsActive(false);
    setStoppedWriting(true);
  };

  const viewAnalysis = () => {
    setShowAnalysis(true);
    setStoppedWriting(false);
    analyzeText();
  };

  // Determine which component to render based on the current state
  const renderContent = () => {
    if (showWordReview) {
      return (
        <WordReview
          words={wordsWithExamples}
          onStartWriting={startWriting}
          onBackAction={backToSetup}
        />
      );
    }

    if (isActive) {
      return (
        <WritingInterface
          timeRemaining={timeRemaining}
          text={text}
          requiredWords={requiredWords}
          onTextChange={handleTextChange}
          onStop={stopTimer}
          onTimeout={handleTimeout}
          initialText={prompt}
        />
      );
    }

    if (stoppedWriting) {
      return (
        <StoppedWritingScreen
          text={text}
          onCopy={copyToClipboard}
          onViewAnalysis={viewAnalysis}
          onNewChallenge={resetChallenge}
        />
      );
    }

    if (showAnalysis) {
      return (
        <AnalysisResults
          text={text}
          analysisResult={analysisResult}
          requiredWords={requiredWords}
          onNewChallenge={resetChallenge}
        />
      );
    }

    return (
      <ChallengeSetup
        selectedTime={selectedTime}
        customTime={customTime}
        prompt={prompt}
        onTimeChange={setSelectedTime}
        onCustomTimeChange={setCustomTime}
        onStart={startReview}
        generateRandomPrompt={generateRandomPrompt}
      />
    );
  };

  return (
    <div
      className="container mx-auto pt-10 flex flex-col"
      style={{ height: "100vh" }}
    >
      {renderContent()}
    </div>
  );
}
