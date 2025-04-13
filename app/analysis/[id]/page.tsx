import { getWritingSession } from "@/components/writing/actions";
import AnalysisResults from "@/components/writing/analysis-results";
import { redirect } from "next/navigation";
import { AnalysisResultType } from "@/components/writing-challenge/types";

async function analyzeText(
  text: string,
  requiredWords: string[],
): Promise<AnalysisResultType> {
  const words = text.toLowerCase().split(/\s+/);
  const usedWords: string[] = [];
  const missingWords: string[] = [];
  const correctUsage: string[] = [];
  const incorrectUsage: string[] = [];

  // Check which required words are used
  requiredWords.forEach((word) => {
    const wordLower = word.toLowerCase();
    if (text.toLowerCase().includes(wordLower)) {
      usedWords.push(word);
      // Basic context check - if the word appears in a proper sentence context
      // This is a simple implementation - you might want to make this more sophisticated
      const wordIndex = words.indexOf(wordLower);
      if (wordIndex !== -1 && wordIndex < words.length - 1) {
        correctUsage.push(word);
      } else {
        incorrectUsage.push(word);
      }
    } else {
      missingWords.push(word);
    }
  });

  return {
    usedWords,
    missingWords,
    correctUsage,
    incorrectUsage,
  };
}

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const session = await getWritingSession(id);

    if (!session.text) {
      redirect("/");
    }

    const analysisResult = await analyzeText(
      session.text,
      session.required_words.map((word) => word.word),
    );

    return (
      <div className="container max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Writing Analysis</h1>
        <AnalysisResults
          text={session.text}
          analysisResult={analysisResult}
          requiredWords={session.required_words}
        />
      </div>
    );
  } catch (error) {
    console.error("Error in analysis page:", error);
    redirect("/");
  }
}
