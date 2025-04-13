"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as React from "react";

interface StoppedWritingScreenProps {
  text: string;
  sessionId: string;
}

export default function StoppedWritingScreen({
  text,
  sessionId,
}: StoppedWritingScreenProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Text copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const router = useRouter();

  const handleViewAnalysis = () => {
    router.push(`/analysis/${sessionId}`);
  };

  const handleNewChallenge = () => {
    router.push("/start");
  };

  return (
    <div className=" flex items-center justify-center w-full h-full">
      <div className="border-red-200 border rounded-lg overflow-hidden">
        <div className="bg-red-50 border-b border-red-200 p-2">
          <h1 className="text-red-700 inline-flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            You stopped writing!
          </h1>
          <p className="text-gray-500 text-sm">
            You paused for too long and your writing session has ended.
          </p>
        </div>
        <div className="pt-6 px-4">
          <div className="space-y-4">
            <div className="border rounded-lg p-4 max-h-[300px] overflow-auto relative">
              <h3 className="text-sm font-medium mb-2">Your writing:</h3>
              <p className="whitespace-pre-wrap">{text}</p>
              <Button
                onClick={handleCopy}
                variant="outline"
                size={"icon"}
                className="flex-1 absolute right-0 top-0 mt-1 mr-1 text-muted-foreground"
              >
                {copied ? <Check /> : <Copy />}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pb-4 sm:justify-between">
              <Button onClick={handleViewAnalysis} className="w-fit">
                View analysis
              </Button>
              <Button
                onClick={handleNewChallenge}
                variant="outline"
                className=" w-fit"
              >
                Start new challenge
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
