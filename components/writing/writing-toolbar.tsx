import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, DownloadIcon, Settings } from "lucide-react";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type FontStyle = "sans" | "serif" | "mono";

interface WritingToolbarProps {
  fontStyle: FontStyle;
  setFontStyle: (f: FontStyle) => void;
  isStopped: boolean;
  handleCopy: () => void;
  handleDownload: () => void;
  wordCount: number;
  charCount: number;
  timerDisplay: React.ReactNode;
  inactivityTimeoutEnabled: boolean;
  setInactivityTimeoutEnabled: (enabled: boolean) => void;
  timeRemaining: number;
  setTimeRemaining: (n: number) => void;
  timerOptions: number[];
  customTimer: number;
  setCustomTimer: (n: number) => void;
}

export default function WritingToolbar({
  fontStyle,
  setFontStyle,
  isStopped,
  handleCopy,
  handleDownload,
  wordCount,
  charCount,
  timerDisplay,
  inactivityTimeoutEnabled,
  setInactivityTimeoutEnabled,
  timeRemaining,
  setTimeRemaining,
  timerOptions,
  customTimer,
  setCustomTimer,
}: WritingToolbarProps) {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [timerSelect, setTimerSelect] = React.useState(
    timerOptions.includes(timeRemaining) ? String(timeRemaining) : "custom"
  );
  React.useEffect(() => {
    if (timerOptions.includes(timeRemaining)) {
      setTimerSelect(String(timeRemaining));
    } else {
      setTimerSelect("custom");
    }
  }, [timeRemaining, timerOptions]);

  return (
    <div className="px-4 flex items-center justify-between flex-[0]">
      <div className="flex items-center gap-2">
        {timerDisplay}
        <Select
          value={fontStyle}
          onValueChange={(value) => setFontStyle(value as FontStyle)}
          disabled={isStopped}
        >
          <SelectTrigger className="w-fit h-5 rounded-sm px-1 border-none shadow-none text-xs text-muted-foreground">
            <SelectValue placeholder="Font style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sans" className="text-sm">
              Sans-serif
            </SelectItem>
            <SelectItem value="serif" className="text-sm">
              Serif
            </SelectItem>
            <SelectItem value="mono" className="text-sm">
              Monospace
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleCopy}
          variant={"ghost"}
          size={"icon"}
          className="hover:text-foreground text-muted-foreground size-5 p-0.5 rounded-sm"
        >
          <Copy className="!size-4" />
        </Button>
        <Button
          onClick={handleDownload}
          variant={"ghost"}
          size={"icon"}
          className="hover:text-foreground text-muted-foreground size-5 rounded-sm"
        >
          <DownloadIcon className="!size-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-xs text-muted-foreground">
          {wordCount} words • {charCount} characters
        </div>
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-2">
              <Settings className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="inactivity-timeout"
                  checked={inactivityTimeoutEnabled}
                  onCheckedChange={setInactivityTimeoutEnabled}
                  className="scale-75"
                />
                <Label
                  htmlFor="inactivity-timeout"
                  className="text-xs text-muted-foreground"
                >
                  Timeout if inactive
                </Label>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="timer-select"
                  className="text-xs text-muted-foreground mb-1"
                >
                  Timer
                </Label>
                <Select
                  value={timerSelect}
                  onValueChange={(val) => {
                    setTimerSelect(val);
                    if (val !== "custom") {
                      setTimeRemaining(Number(val));
                    }
                  }}
                >
                  <SelectTrigger
                    id="timer-select"
                    className="w-full h-8 text-xs"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timerOptions.map((opt) => (
                      <SelectItem
                        key={opt}
                        value={String(opt)}
                        className="text-xs"
                      >
                        {opt / 60} min
                      </SelectItem>
                    ))}
                    <SelectItem value="custom" className="text-xs">
                      Custom
                    </SelectItem>
                  </SelectContent>
                </Select>
                {timerSelect === "custom" && (
                  <div className="flex gap-2 items-center mt-1">
                    <Input
                      type="number"
                      min={1}
                      value={customTimer || ""}
                      onChange={(e) => setCustomTimer(Number(e.target.value))}
                      className="w-16 h-8 text-xs"
                      placeholder="Minutes"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (customTimer > 0) {
                          setTimeRemaining(customTimer * 60);
                        }
                      }}
                    >
                      Set
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
