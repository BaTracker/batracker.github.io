import { GameRecord, ComparisonData } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface BasicStatusProps {
  records: GameRecord[];
  latestRecord: GameRecord | null;
}

export function BasicStatus({ records, latestRecord }: BasicStatusProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // 获取上一条记录（如果有）
  const previousRecord = records.length > 1 ? records[1] : null;
  
  // 不需要单独的计算函数，直接在比较数据中计算
  
  if (!latestRecord) {
    return (
      <div className={cn(
        "rounded-lg p-5 mb-6 transition-all duration-200",
        "border shadow-sm hover:shadow-md",
        "animate-in fade-in slide-in-from-bottom-5 duration-200",
        isDark 
          ? "bg-gray-900 border-gray-800 text-gray-100" 
          : "bg-white border-gray-200 text-gray-900"
      )}>
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center p-2 rounded-full bg-opacity-20 animate-pulse-slow"
            style={{
              backgroundColor: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(37, 99, 235, 0.1)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </span>
          <h2 className={cn(
            "text-xl font-bold relative",
            isDark ? "text-sky-400" : "text-blue-600"
          )}>
            今日进度
          </h2>
        </div>
        
        <div className={cn(
          "p-6 text-center rounded-lg",
          "animate-in fade-in slide-in-from-bottom-5 duration-500",
          isDark 
            ? "bg-gray-800 text-gray-400" 
            : "bg-gray-50 text-gray-500"
        )}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg">没有找到记录</p>
          <p className="text-sm mt-2">请在上方添加您的第一条记录</p>
        </div>
      </div>
    );
  }

  // 计算比较数据
  const comparison: ComparisonData = {
    level: { 
      value: latestRecord.level, 
      change: previousRecord ? latestRecord.level - previousRecord.level : 0,
      percentage: previousRecord && previousRecord.level > 0 ? ((latestRecord.level - previousRecord.level) / previousRecord.level) * 100 : 0
    },
    levelPoints: { 
      value: latestRecord.levelPoints, 
      change: previousRecord ? latestRecord.levelPoints - previousRecord.levelPoints : 0,
      percentage: previousRecord && previousRecord.levelPoints > 0 ? ((latestRecord.levelPoints - previousRecord.levelPoints) / previousRecord.levelPoints) * 100 : 0
    },
    blueCrystals: { 
      value: latestRecord.blueCrystals, 
      change: previousRecord ? latestRecord.blueCrystals - previousRecord.blueCrystals : 0,
      percentage: previousRecord && previousRecord.blueCrystals > 0 ? ((latestRecord.blueCrystals - previousRecord.blueCrystals) / previousRecord.blueCrystals) * 100 : 0
    },
    stamina: { 
      value: latestRecord.stamina, 
      change: previousRecord ? latestRecord.stamina - previousRecord.stamina : 0,
      percentage: previousRecord && previousRecord.stamina > 0 ? ((latestRecord.stamina - previousRecord.stamina) / previousRecord.stamina) * 100 : 0
    }
  };
  
  const availableDraws = Math.floor(latestRecord.blueCrystals / 120);
  const tenDraws = Math.floor(availableDraws / 10);
  const singleDraws = availableDraws % 10;

  return (
    <div className="w-full">
      <div className={cn(
        "rounded-xl p-6 shadow-lg backdrop-blur-sm transition-all duration-200",
        "hover:shadow-xl animate-fadeIn",
        isDark 
          ? "bg-slate-900/80 border border-slate-800 text-gray-100" 
          : "bg-white/90 border border-slate-200 text-gray-900"
      )}>
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center p-2 rounded-full bg-opacity-20 animate-pulse-slow"
            style={{
              backgroundColor: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(37, 99, 235, 0.1)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </span>
          <h2 className={cn(
            "text-xl font-bold relative",
            isDark ? "text-sky-400" : "text-blue-600"
          )}>
            当前进度
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <div className={cn(
            "text-center p-4 rounded-lg transition-all duration-300",
            "transform hover:scale-105 shadow-sm hover:shadow-md",
            "animate-in fade-in slide-in-from-bottom-5 duration-500",
            isDark 
              ? "bg-blue-900/20 border border-blue-800/30" 
              : "bg-blue-50 border border-blue-100"
          )} style={{ animationDelay: '100ms' }}>
            <div className={cn(
              "text-3xl font-bold mb-1",
              isDark ? "text-blue-400" : "text-blue-600"
            )}>{latestRecord.level}</div>
            <div className={cn(
              "text-sm font-medium",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>等级</div>
            {comparison.level.change !== 0 && (
              <div className={cn(
                "mt-2 text-xs font-medium flex items-center justify-center",
                comparison.level.change > 0 
                  ? (isDark ? "text-green-400" : "text-green-600") 
                  : (isDark ? "text-red-400" : "text-red-500")
              )}>
                {comparison.level.change > 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{comparison.level.change > 0 ? '+' : ''}{comparison.level.change} ({comparison.level.percentage.toFixed(2)}%)</span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "text-center p-4 rounded-lg transition-all duration-300",
            "transform hover:scale-105 shadow-sm hover:shadow-md",
            "animate-in fade-in slide-in-from-bottom-5 duration-500",
            isDark 
              ? "bg-purple-900/20 border border-purple-800/30" 
              : "bg-purple-50 border border-purple-100"
          )} style={{ animationDelay: '150ms' }}>
            <div className={cn(
              "text-3xl font-bold mb-1",
              isDark ? "text-purple-400" : "text-purple-600"
            )}>{latestRecord.levelPoints}</div>
            <div className={cn(
              "text-sm font-medium",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>等级经验</div>
            {comparison.levelPoints.change !== 0 && (
              <div className={cn(
                "mt-2 text-xs font-medium flex items-center justify-center",
                comparison.levelPoints.change > 0 
                  ? (isDark ? "text-green-400" : "text-green-600") 
                  : (isDark ? "text-red-400" : "text-red-500")
              )}>
                {comparison.levelPoints.change > 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{comparison.levelPoints.change > 0 ? '+' : ''}{comparison.levelPoints.change} ({comparison.levelPoints.percentage.toFixed(2)}%)</span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "text-center p-4 rounded-lg transition-all duration-300",
            "transform hover:scale-105 shadow-sm hover:shadow-md",
            "animate-in fade-in slide-in-from-bottom-5 duration-500",
            isDark 
              ? "bg-cyan-900/20 border border-cyan-800/30" 
              : "bg-cyan-50 border border-cyan-100"
          )} style={{ animationDelay: '200ms' }}>
            <div className={cn(
              "text-3xl font-bold mb-1",
              isDark ? "text-cyan-400" : "text-cyan-600"
            )}>{latestRecord.blueCrystals.toLocaleString()}</div>
            <div className={cn(
              "text-sm font-medium",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>青辉石</div>
            {comparison.blueCrystals.change !== 0 && (
              <div className={cn(
                "mt-2 text-xs font-medium flex items-center justify-center",
                comparison.blueCrystals.change > 0 
                  ? (isDark ? "text-green-400" : "text-green-600") 
                  : (isDark ? "text-red-400" : "text-red-500")
              )}>
                {comparison.blueCrystals.change > 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{comparison.blueCrystals.change > 0 ? '+' : ''}{comparison.blueCrystals.change.toLocaleString()} ({comparison.blueCrystals.percentage.toFixed(2)}%)</span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "text-center p-4 rounded-lg transition-all duration-300",
            "transform hover:scale-105 shadow-sm hover:shadow-md",
            "animate-in fade-in slide-in-from-bottom-5 duration-500",
            isDark 
              ? "bg-green-900/20 border border-green-800/30" 
              : "bg-green-50 border border-green-100"
          )} style={{ animationDelay: '250ms' }}>
            <div className={cn(
              "text-3xl font-bold mb-1",
              isDark ? "text-green-400" : "text-green-600"
            )}>{latestRecord.stamina}</div>
            <div className={cn(
              "text-sm font-medium",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>体力</div>
            {comparison.stamina.change !== 0 && (
              <div className={cn(
                "mt-2 text-xs font-medium flex items-center justify-center",
                comparison.stamina.change > 0 
                  ? (isDark ? "text-green-400" : "text-green-600") 
                  : (isDark ? "text-red-400" : "text-red-500")
              )}>
                {comparison.stamina.change > 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{comparison.stamina.change > 0 ? '+' : ''}{comparison.stamina.change} ({comparison.stamina.percentage.toFixed(2)}%)</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-5">
          <div className={cn(
            "p-5 rounded-lg transition-all duration-300 flex-1",
            "border shadow-sm",
            "animate-in fade-in slide-in-from-bottom-5 duration-500",
            isDark 
              ? "bg-cyan-900/20 border-cyan-800/30" 
              : "bg-cyan-50 border-cyan-200"
          )} style={{ animationDelay: '300ms' }}>
            <h3 className={cn(
              "font-semibold mb-3 flex items-center gap-2",
              isDark ? "text-cyan-300" : "text-cyan-700"
            )}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              抽卡状态
            </h3>
            <p className={cn(
              "mb-3 font-medium",
              isDark ? "text-gray-300" : "text-gray-700"
            )}>
              当前可用抽卡次数: <span className="font-bold">{availableDraws}</span>
              {tenDraws > 0 && (
                <span className="ml-1">({tenDraws} 十连抽{singleDraws > 0 && ` + ${singleDraws} 单抽`})</span>
              )}
            </p>
            <div className={cn(
              "inline-block px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
              "shadow-sm transform hover:scale-105",
              availableDraws >= 200 
                ? isDark 
                  ? "bg-green-800/50 text-green-300 border border-green-700" 
                  : "bg-green-100 text-green-800 border border-green-200"
                : isDark 
                  ? "bg-gray-800 text-gray-300 border border-gray-700" 
                  : "bg-gray-100 text-gray-800 border border-gray-200"
            )}>
              {
                (() => {
                  // 计算已有几井和剩余抽数
                  const wellSize = 200; // 一井等于200抽
                  const completedWells = Math.floor(availableDraws / wellSize);
                  const nextWellNumber = completedWells + 1;
                  const remainingDraws = wellSize - (availableDraws % wellSize);
                  
                  if (remainingDraws === 0 && availableDraws > 0) {
                    // 刚好达到整数井
                    return (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {completedWells}井已准备就绪！
                      </span>
                    );
                  } else {
                    // 还差一些抽数
                    return (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        距离{nextWellNumber}井还差 {remainingDraws} 抽
                      </span>
                    );
                  }
                })()
              }
            </div>
          </div>
          
          <div className={cn(
            "p-5 rounded-lg transition-all duration-300 flex-1",
            "border shadow-sm",
            "animate-in fade-in slide-in-from-bottom-5 duration-500",
            isDark 
              ? "bg-red-900/20 border-red-800/30 text-red-300" 
              : "bg-red-50 border-red-200 text-red-700"
          )} style={{ animationDelay: '350ms' }}>
            <h3 className={cn(
              "font-semibold mb-3 flex items-center gap-2",
              isDark ? "text-red-300" : "text-red-700"
            )}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              抽卡计划
            </h3>
            <p className={cn(
              "text-sm",
              isDark ? "text-red-400" : "text-red-700"
            )}>
              建议在抽卡前至少存够一井的青辉石，并确定你喜欢的角色。不要成为赌狗。
            </p>
            <div className={cn(
              "mt-2 text-xs font-medium px-3 py-1.5 rounded-full inline-block",
              isDark ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-800"
            )}>
              一井 = 200抽 = 20个十连 = 24,000青辉石
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}