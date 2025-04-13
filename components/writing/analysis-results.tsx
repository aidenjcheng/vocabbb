"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import type { AnalysisResultType, WordType } from "../writing-challenge/types";
import { redirect } from "next/navigation";

interface AnalysisResultsProps {
  text: string;
  analysisResult: AnalysisResultType | null;
  requiredWords: WordType[];
}

export default function AnalysisResults({
  text,
  analysisResult,
  requiredWords,
}: AnalysisResultsProps) {
  const handleNewChallenge = () => {
    redirect("/");
  };

  return (
    <div>
      {analysisResult ? (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Word Usage Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <p className="font-medium mb-2">
                  Words Used: {analysisResult.usedWords.length}/
                  {requiredWords.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.usedWords.map((word) => (
                    <Badge key={word} variant="secondary">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <p className="font-medium mb-2">
                  Words Missing: {analysisResult.missingWords.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.missingWords.map((word) => (
                    <Badge key={word} variant="outline">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Understanding Analysis</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 border-green-200 bg-green-50">
                <div className="flex items-center mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <p className="font-medium">Correct Usage</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.correctUsage.map((word) => (
                    <Badge
                      key={word}
                      variant="outline"
                      className="bg-green-100 text-green-800 hover:bg-green-200"
                    >
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="border rounded-lg p-4 border-red-200 bg-red-50">
                <div className="flex items-center mb-2">
                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  <p className="font-medium">Incorrect Usage</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.incorrectUsage.map((word) => (
                    <Badge
                      key={word}
                      variant="outline"
                      className="bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Your Writing</h3>
            <p className="whitespace-pre-wrap">{text}</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-8">
          <p>Analyzing your writing...</p>
        </div>
      )}
      <Button onClick={handleNewChallenge} className="w-full">
        Start New Challenge
      </Button>
    </div>
  );
}
