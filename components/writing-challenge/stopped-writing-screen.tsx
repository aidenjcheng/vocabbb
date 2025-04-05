"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface StoppedWritingScreenProps {
  text: string;
  onCopy: () => void;
  onViewAnalysis: () => void;
  onNewChallenge: () => void;
}

export default function StoppedWritingScreen({
  text,
  onCopy,
  onViewAnalysis,
  onNewChallenge,
}: StoppedWritingScreenProps) {
  return (
    <div className="border-red-200">
      <div className="bg-red-50 border-b border-red-200">
        <h1 className="text-red-700 flex items-center">
          <AlertCircle className="mr-2 h-5 w-5" />
          You stopped writing!
        </h1>
        <p className="text-gray-500">
          You paused for too long and your writing session has ended.
        </p>
      </div>
      <div className="pt-6">
        <div className="space-y-4">
          <div className="border rounded-lg p-4 max-h-[300px] overflow-auto">
            <h3 className="text-sm font-medium mb-2">Your writing:</h3>
            <p className="whitespace-pre-wrap">{text}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={onCopy} variant="outline" className="flex-1">
              Copy to clipboard
            </Button>
            <Button onClick={onViewAnalysis} className="flex-1">
              View analysis
            </Button>
          </div>
        </div>
      </div>
      <CardFooter className="bg-muted/50 border-t">
        <Button onClick={onNewChallenge} variant="ghost" className="w-full">
          Start new challenge
        </Button>
      </CardFooter>
    </div>
  );
}
