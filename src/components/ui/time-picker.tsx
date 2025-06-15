import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';

interface TimePickerProps {
  time?: Date;
  setTime: (time: Date) => void;
  className?: string;
}

export function TimePicker({ time, setTime, className }: TimePickerProps) {
  const [hours, setHours] = useState<number>(time ? time.getHours() : 0);
  const [minutes, setMinutes] = useState<number>(time ? time.getMinutes() : 0);
  const [seconds, setSeconds] = useState<number>(time ? time.getSeconds() : 0);

  const handleTimeChange = (newHours: number, newMinutes: number, newSeconds: number) => {
    const newTime = new Date();
    newTime.setHours(newHours);
    newTime.setMinutes(newMinutes);
    newTime.setSeconds(newSeconds);
    setTime(newTime);
  };

  const formatTimeUnit = (unit: number): string => {
    return unit.toString().padStart(2, '0');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !time && 'text-muted-foreground',
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time ? 
            `${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}` : 
            <span>选择时间</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex items-center justify-between space-x-2">
          <div className="grid gap-1 text-center">
            <div className="text-sm font-medium">时</div>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  const newHours = (hours - 1 + 24) % 24;
                  setHours(newHours);
                  handleTimeChange(newHours, minutes, seconds);
                }}
              >
                -
              </Button>
              <div className="w-12 text-center">{formatTimeUnit(hours)}</div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  const newHours = (hours + 1) % 24;
                  setHours(newHours);
                  handleTimeChange(newHours, minutes, seconds);
                }}
              >
                +
              </Button>
            </div>
          </div>
          <div className="grid gap-1 text-center">
            <div className="text-sm font-medium">分</div>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  const newMinutes = (minutes - 1 + 60) % 60;
                  setMinutes(newMinutes);
                  handleTimeChange(hours, newMinutes, seconds);
                }}
              >
                -
              </Button>
              <div className="w-12 text-center">{formatTimeUnit(minutes)}</div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  const newMinutes = (minutes + 1) % 60;
                  setMinutes(newMinutes);
                  handleTimeChange(hours, newMinutes, seconds);
                }}
              >
                +
              </Button>
            </div>
          </div>
          <div className="grid gap-1 text-center">
            <div className="text-sm font-medium">秒</div>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  const newSeconds = (seconds - 1 + 60) % 60;
                  setSeconds(newSeconds);
                  handleTimeChange(hours, minutes, newSeconds);
                }}
              >
                -
              </Button>
              <div className="w-12 text-center">{formatTimeUnit(seconds)}</div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  const newSeconds = (seconds + 1) % 60;
                  setSeconds(newSeconds);
                  handleTimeChange(hours, minutes, newSeconds);
                }}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}