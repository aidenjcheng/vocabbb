"use client";

import { AlertCircle, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WritingCompleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  text: string;
  sessionId: string;
}

export default function WritingCompleteDialog({
  open,
  onOpenChange,
  text,
  sessionId,
}: WritingCompleteDialogProps) {
  const [dialogCopied, setDialogCopied] = useState(false);
  const router = useRouter();

  const handleDialogCopy = async () => {
    await navigator.clipboard.writeText(text);
    setDialogCopied(true);
    toast.success("Text copied to clipboard");
    setTimeout(() => setDialogCopied(false), 2000);
  };

  const handleViewAnalysis = () => {
    router.push(`/analysis/${sessionId}`);
  };

  const handleNewChallenge = () => {
    router.push("/start");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="max-w-lg !p-0 overflow-hidden border-red-200 border w-full"
        overlayClassName="backdrop-blur-[6px] bg-red-500/30 duration-0 ease-none"
      >
        <div className="bg-red-50 border-b border-red-200 p-4 max-w-lg">
          <AlertDialogTitle className="text-red-700 inline-flex items-center m-0 p-0">
            <AlertCircle className="mr-2 h-5 w-5" />
            You stopped writing!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 text-sm mt-1">
            You paused for too long and your writing session has ended.
          </AlertDialogDescription>
        </div>
        <div className="pt-6 px-4 max-w-lg">
          <div className="space-y-4">
            <div className="border rounded-lg p-4 overflow-auto relative">
              <h3 className="text-sm font-medium mb-2">Your writing:</h3>
              <p className="whitespace-pre-wrap break-words">{text}</p>
              <Button
                onClick={handleDialogCopy}
                variant="outline"
                size={"icon"}
                className="flex-1 absolute right-0 top-0 mt-1 mr-1 text-muted-foreground"
              >
                {dialogCopied ? <Check /> : <Copy />}
              </Button>
            </div>

            <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 pb-4 sm:!justify-between">
              <AlertDialogAction asChild>
                <Button onClick={handleViewAnalysis} className="w-fit">
                  View analysis
                </Button>
              </AlertDialogAction>
              <AlertDialogCancel asChild>
                <Button
                  onClick={handleNewChallenge}
                  variant="outline"
                  className="w-fit"
                >
                  Start new challenge
                </Button>
              </AlertDialogCancel>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}