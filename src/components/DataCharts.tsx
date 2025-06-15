import { useState, useMemo } from 'react';
import { GameRecord } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

interface DataChartsProps {
  records: GameRecord[];
}

// 使用从types/index.ts导入的ChartDataPoint类型

export function DataCharts({ records }: DataChartsProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const [selectedDate, setSelectedDate] = useState<string>("");
  
  // 获取所有不重复的日期
  const uniqueDates = useMemo(() => {
    const dates = [...new Set(records.map(record => record.date))];
    return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [records]);
  
  // 设置默认选择的日期为最新的日期
  useMemo(() => {
    if (uniqueDates.length > 0 && !selectedDate) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDate]);
  
  // 每天最后一条记录的数据
  const dailyLastRecords = useMemo(() => {
    const lastRecordsByDate: Record<string, GameRecord> = {};
    
    // 按日期分组，并获取每天的最后一条记录
    records.forEach(record => {
      if (!lastRecordsByDate[record.date] || record.timestamp > lastRecordsByDate[record.date].timestamp) {
        lastRecordsByDate[record.date] = record;
      }
    });
    
    // 转换为数组并按日期排序
    return Object.values(lastRecordsByDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(record => ({
        date: record.date,
        level: record.level,
        levelPoints: record.levelPoints,
        blueCrystals: record.blueCrystals,
        stamina: record.stamina
      }));
  }, [records]);
  
  // 获取选定日期的所有记录
  const selectedDateRecords = useMemo(() => {
    if (!selectedDate) return [];
    
    return records
      .filter(record => record.date === selectedDate)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(record => ({
        time: new Date(record.timestamp).toLocaleTimeString(),
        level: record.level,
        levelPoints: record.levelPoints,
        blueCrystals: record.blueCrystals,
        stamina: record.stamina
      }));
  }, [records, selectedDate]);
  
  const chartConfig = {
    level: {
      label: "等级",
      theme: {
        light: "#3b82f6",
        dark: "#60a5fa"
      }
    },
    levelPoints: {
      label: "等级经验",
      theme: {
        light: "#8b5cf6",
        dark: "#a78bfa"
      }
    },
    blueCrystals: {
      label: "青辉石",
      theme: {
        light: "#06b6d4",
        dark: "#22d3ee"
      }
    },
    stamina: {
      label: "体力",
      theme: {
        light: "#10b981",
        dark: "#34d399"
      }
    }
  };

  return (
    <div className={cn(
      "rounded-xl p-4 sm:p-5 md:p-6 shadow-lg backdrop-blur-sm",
      "border-2 transition-all duration-300 hover:shadow-xl",
      "animate-fadeIn",
      isDark 
        ? "bg-slate-900/80 border-slate-800 text-slate-100" 
        : "bg-white/90 border-slate-200 text-slate-900"
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center p-2 rounded-full bg-opacity-20 animate-pulse-slow"
            style={{
              backgroundColor: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(37, 99, 235, 0.1)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
          </span>
          <h2 className={cn(
            "text-xl font-bold relative",
            isDark ? "text-sky-400" : "text-blue-600"
          )}>
            数据统计
          </h2>
        </div>
      </div>
      
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="daily">每日趋势</TabsTrigger>
          <TabsTrigger value="intraday">单日详情</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-4 px-0 sm:px-1">
          <div className="w-full" style={{ minHeight: '400px' }}>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={dailyLastRecords} margin={{ top: 5, right: 10, left: 5, bottom: 10 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
                   <XAxis 
                     dataKey="date" 
                     stroke={isDark ? "#94a3b8" : "#64748b"}
                     tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
                   />
                  <YAxis 
                    yAxisId="left" 
                    stroke={isDark ? "#94a3b8" : "#64748b"}
                    tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke={isDark ? "#94a3b8" : "#64748b"}
                    tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', marginTop: '5px' }} />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="level" 
                    name="等级" 
                    stroke="var(--color-level)" 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="levelPoints" 
                    name="等级经验" 
                    stroke="var(--color-levelPoints)" 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="blueCrystals" 
                    name="青辉石" 
                    stroke="var(--color-blueCrystals)" 
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="stamina" 
                    name="体力" 
                    stroke="var(--color-stamina)" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="intraday" className="space-y-4 px-0 sm:px-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className={cn(
              "text-lg font-semibold",
              isDark ? "text-sky-300" : "text-blue-700"
            )}>单日数据变化</h3>
            
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择日期" />
              </SelectTrigger>
              <SelectContent>
                {uniqueDates.map(date => (
                  <SelectItem key={date} value={date}>{date}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedDateRecords.length > 0 ? (
            <div className="w-full" style={{ minHeight: '400px' }}>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedDateRecords} margin={{ top: 5, right: 10, left: 5, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
                  <XAxis 
                    dataKey="time" 
                    stroke={isDark ? "#94a3b8" : "#64748b"}
                    tick={{ fill: isDark ? "#94a3b8" : "#64748b" }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    stroke={isDark ? "#94a3b8" : "#64748b"}
                    tick={{ fill: isDark ? "#94a3b8" : "#64748b" }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke={isDark ? "#94a3b8" : "#64748b"}
                    tick={{ fill: isDark ? "#94a3b8" : "#64748b" }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="level" 
                    name="等级" 
                    stroke="var(--color-level)" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="levelPoints" 
                    name="等级经验" 
                    stroke="var(--color-levelPoints)" 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="blueCrystals" 
                    name="青辉石" 
                    stroke="var(--color-blueCrystals)" 
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="stamina" 
                    name="体力" 
                    stroke="var(--color-stamina)" 
                  />
                </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          ) : (
            <div className={cn(
              "p-8 text-center rounded-xl",
              "animate-slideUpFade duration-500",
              isDark 
                ? "bg-slate-800/70 text-slate-400" 
                : "bg-slate-50/80 text-slate-500"
            )}>
              <p>该日期没有记录数据</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}