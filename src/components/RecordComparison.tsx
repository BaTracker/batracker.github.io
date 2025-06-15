import { useState, useMemo } from 'react';
import { GameRecord, ComparisonData } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RecordComparisonProps {
  records: GameRecord[];
  compareRecords: (current: GameRecord, previous: GameRecord) => ComparisonData;
}

export function RecordComparison({ records, compareRecords }: RecordComparisonProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const [selectedRecord1, setSelectedRecord1] = useState<string>("");
  const [selectedRecord2, setSelectedRecord2] = useState<string>("");
  
  // 获取所有记录的ID和日期时间信息，用于下拉选择
  const recordOptions = useMemo(() => {
    return records.map(record => ({
      id: record.id,
      label: `${record.date} ${new Date(record.timestamp).toLocaleTimeString()}`
    }));
  }, [records]);
  
  // 获取选中的记录对象
  const record1 = useMemo(() => {
    return records.find(r => r.id === selectedRecord1) || null;
  }, [records, selectedRecord1]);
  
  const record2 = useMemo(() => {
    return records.find(r => r.id === selectedRecord2) || null;
  }, [records, selectedRecord2]);
  
  // 计算比较结果
  const comparison = useMemo(() => {
    if (record1 && record2) {
      return compareRecords(record1, record2);
    }
    return null;
  }, [record1, record2, compareRecords]);
  
  // 格式化百分比显示
  const formatPercentage = (value: number) => {
    return value.toFixed(2) + '%';
  };

  return (
    <div className={cn(
      "rounded-xl p-6 shadow-lg backdrop-blur-sm",
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
              <path fillRule="evenodd" d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </span>
          <h2 className={cn(
            "text-xl font-bold relative",
            isDark ? "text-sky-400" : "text-blue-600"
          )}>
            记录比较
          </h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className={cn(
            "block text-sm font-medium mb-2",
            isDark ? "text-slate-300" : "text-slate-700"
          )}>选择第一条记录</label>
          <Select value={selectedRecord1} onValueChange={setSelectedRecord1}>
            <SelectTrigger>
              <SelectValue placeholder="选择记录" />
            </SelectTrigger>
            <SelectContent>
              {recordOptions.map(option => (
                <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className={cn(
            "block text-sm font-medium mb-2",
            isDark ? "text-slate-300" : "text-slate-700"
          )}>选择第二条记录</label>
          <Select value={selectedRecord2} onValueChange={setSelectedRecord2}>
            <SelectTrigger>
              <SelectValue placeholder="选择记录" />
            </SelectTrigger>
            <SelectContent>
              {recordOptions.map(option => (
                <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {record1 && record2 && comparison ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={cn(
              "p-4 rounded-lg transition-all duration-300",
              "border hover:shadow-sm",
              isDark 
                ? "bg-blue-900/10 border-blue-800/30" 
                : "bg-blue-50 border-blue-100"
            )}>
              <div className="flex flex-col">
                <span className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  等级
                </span>
                <div className="flex justify-between items-center mt-1">
                  <span className={cn(
                    "text-xl font-bold",
                    isDark ? "text-blue-400" : "text-blue-700"
                  )}>{record1.level} → {record2.level}</span>
                </div>
                <div className={cn(
                  "mt-2 text-xs font-medium flex items-center",
                  comparison.level.change > 0 
                    ? (isDark ? "text-green-400" : "text-green-600") 
                    : comparison.level.change < 0 
                      ? (isDark ? "text-red-400" : "text-red-500")
                      : (isDark ? "text-slate-400" : "text-slate-500")
                )}>
                  {comparison.level.change > 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : comparison.level.change < 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{comparison.level.change > 0 ? '+' : ''}{comparison.level.change} ({formatPercentage(comparison.level.percentage)})</span>
                </div>
              </div>
            </div>
            
            <div className={cn(
              "p-4 rounded-lg transition-all duration-300",
              "border hover:shadow-sm",
              isDark 
                ? "bg-purple-900/10 border-purple-800/30" 
                : "bg-purple-50 border-purple-100"
            )}>
              <div className="flex flex-col">
                <span className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  等级经验
                </span>
                <div className="flex justify-between items-center mt-1">
                  <span className={cn(
                    "text-xl font-bold",
                    isDark ? "text-purple-400" : "text-purple-700"
                  )}>{record1.levelPoints} → {record2.levelPoints}</span>
                </div>
                <div className={cn(
                  "mt-2 text-xs font-medium flex items-center",
                  comparison.levelPoints.change > 0 
                    ? (isDark ? "text-green-400" : "text-green-600") 
                    : comparison.levelPoints.change < 0 
                      ? (isDark ? "text-red-400" : "text-red-500")
                      : (isDark ? "text-slate-400" : "text-slate-500")
                )}>
                  {comparison.levelPoints.change > 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : comparison.levelPoints.change < 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{comparison.levelPoints.change > 0 ? '+' : ''}{comparison.levelPoints.change} ({formatPercentage(comparison.levelPoints.percentage)})</span>
                </div>
              </div>
            </div>
            
            <div className={cn(
              "p-4 rounded-lg transition-all duration-300",
              "border hover:shadow-sm",
              isDark 
                ? "bg-cyan-900/10 border-cyan-800/30" 
                : "bg-cyan-50 border-cyan-100"
            )}>
              <div className="flex flex-col">
                <span className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  青辉石
                </span>
                <div className="flex justify-between items-center mt-1">
                  <span className={cn(
                    "text-xl font-bold",
                    isDark ? "text-cyan-400" : "text-cyan-700"
                  )}>{record1.blueCrystals.toLocaleString()} → {record2.blueCrystals.toLocaleString()}</span>
                </div>
                <div className={cn(
                  "mt-2 text-xs font-medium flex items-center",
                  comparison.blueCrystals.change > 0 
                    ? (isDark ? "text-green-400" : "text-green-600") 
                    : comparison.blueCrystals.change < 0 
                      ? (isDark ? "text-red-400" : "text-red-500")
                      : (isDark ? "text-slate-400" : "text-slate-500")
                )}>
                  {comparison.blueCrystals.change > 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : comparison.blueCrystals.change < 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{comparison.blueCrystals.change > 0 ? '+' : ''}{comparison.blueCrystals.change.toLocaleString()} ({formatPercentage(comparison.blueCrystals.percentage)})</span>
                </div>
              </div>
            </div>
            
            <div className={cn(
              "p-4 rounded-lg transition-all duration-300",
              "border hover:shadow-sm",
              isDark 
                ? "bg-green-900/10 border-green-800/30" 
                : "bg-green-50 border-green-100"
            )}>
              <div className="flex flex-col">
                <span className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  体力
                </span>
                <div className="flex justify-between items-center mt-1">
                  <span className={cn(
                    "text-xl font-bold",
                    isDark ? "text-green-400" : "text-green-700"
                  )}>{record1.stamina} → {record2.stamina}</span>
                </div>
                <div className={cn(
                  "mt-2 text-xs font-medium flex items-center",
                  comparison.stamina.change > 0 
                    ? (isDark ? "text-green-400" : "text-green-600") 
                    : comparison.stamina.change < 0 
                      ? (isDark ? "text-red-400" : "text-red-500")
                      : (isDark ? "text-slate-400" : "text-slate-500")
                )}>
                  {comparison.stamina.change > 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : comparison.stamina.change < 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{comparison.stamina.change > 0 ? '+' : ''}{comparison.stamina.change} ({formatPercentage(comparison.stamina.percentage)})</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "p-4 rounded-lg text-sm",
            isDark ? "bg-slate-800/70 text-slate-300" : "bg-slate-100/70 text-slate-700"
          )}>
            <p>比较时间范围: {new Date(record1.timestamp).toLocaleString()} → {new Date(record2.timestamp).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <div className={cn(
          "p-8 text-center rounded-xl",
          "animate-slideUpFade duration-500",
          isDark 
            ? "bg-slate-800/70 text-slate-400" 
            : "bg-slate-50/80 text-slate-500"
        )}>
          <p>请选择两条记录进行比较</p>
        </div>
      )}
    </div>
  );
}