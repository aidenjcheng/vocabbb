import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import type { TimerOption } from "./types";

interface ChallengeSetupProps {
  selectedTime: TimerOption;
  customTime: number;
  prompt: string;
  onTimeChange: (time: TimerOption) => void;
  onCustomTimeChange: (time: number) => void;
  onStart: () => void;
  generateRandomPrompt: () => void;
}

export default function ChallengeSetup({
  selectedTime,
  customTime,
  prompt,
  onTimeChange,
  onCustomTimeChange,
  onStart,
  generateRandomPrompt,
}: ChallengeSetupProps) {
  return (
    <div className="mb-6 flex flex-col items-center justify-between h-full">
      <div className="flex flex-col w-full">
        <div>
          {" "}
          <h1 className="text-2xl font-semibold">Choose Your Challenge</h1>
          <p className="text-gray-500">
            Select a time limit for your writing challenge
          </p>
        </div>

        <div style={{ marginTop: "40px" }}>
          <Tabs
            defaultValue="5"
            onValueChange={(value) => {
              const intValue = parseInt(value);
              if (!isNaN(intValue)) {
                onTimeChange(intValue.toString() as TimerOption);
              } else {
                onTimeChange("custom" as TimerOption);
              }
              console.log(typeof value);
            }}
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="5">5 min</TabsTrigger>
              <TabsTrigger value="10">10 min</TabsTrigger>
              <TabsTrigger value="15">15 min</TabsTrigger>
              <TabsTrigger value="20">20 min</TabsTrigger>
              <TabsTrigger value="25">25 min</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            {selectedTime === "custom" && (
              <div className="flex items-center gap-4 mt-4">
                <Label htmlFor="custom-time">Minutes:</Label>
                <Input
                  id="custom-time"
                  type="number"
                  min="1"
                  max="60"
                  value={customTime}
                  onChange={(e) =>
                    onCustomTimeChange(Number.parseInt(e.target.value) || 1)
                  }
                  className="w-24"
                />
              </div>
            )}
          </Tabs>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Your Writing Prompt:</h3>
            <p className="text-xl  font-medium  py-2 border-b ">{prompt}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between w-full">
        <Button
          onClick={generateRandomPrompt}
          className="w-fit"
          variant={"outline"}
        >
          Generate new prompt
        </Button>
        <Button onClick={onStart} className="w-fit" variant={"default"}>
          Review Vocabulary Words
        </Button>
      </div>
    </div>
  );
}
