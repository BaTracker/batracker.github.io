import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface BasicFormProps {
  onSubmit: (data: {
    level: number;
    levelPoints: number;
    blueCrystals: number;
    stamina: number;
  }) => void;
}

export function BasicForm({ onSubmit }: BasicFormProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const [level, setLevel] = useState('');
  const [levelPoints, setLevelPoints] = useState('');
  const [blueCrystals, setBlueCrystals] = useState('');
  const [stamina, setStamina] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const record = {
      level: parseInt(level) || 0,
      levelPoints: parseInt(levelPoints) || 0,
      blueCrystals: parseInt(blueCrystals) || 0,
      stamina: parseInt(stamina) || 0,
      date: new Date().toISOString(),
    };
    
    // Simulate a short delay for animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onSubmit(record);
    
    // Reset form
    setLevel('');
    setLevelPoints('');
    setBlueCrystals('');
    setStamina('');
    setIsSubmitting(false);
  };

  return (
    <div className={cn(
      "rounded-xl p-6 mb-6 transition-all duration-300",
      "border shadow-md hover:shadow-lg",
      "animate-fadeIn",
      isDark 
        ? "bg-slate-900/80 border-slate-800 text-slate-100 backdrop-blur-sm" 
        : "bg-white/90 border-slate-200 text-slate-900 backdrop-blur-sm"
    )}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={cn(
          "text-xl font-bold",
          "flex items-center gap-2",
          "relative",
          isDark ? "text-sky-400" : "text-blue-600"
        )}>
          <span className="flex items-center justify-center p-2 rounded-full bg-opacity-20 animate-pulse-slow"
            style={{
              backgroundColor: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(37, 99, 235, 0.1)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </span>
          <span>
            记录当前数据
          </span>
        </h2>
        

      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 group animate-slideUpFade" style={{ animationDelay: '100ms' }}>
            <label className={cn(
              "block text-sm font-medium mb-1 transition-colors duration-200",
              "flex items-center gap-1.5",
              isDark ? "text-slate-300 group-hover:text-sky-300" : "text-slate-700 group-hover:text-blue-700"
            )}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V4z" clipRule="evenodd" />
              </svg>
              等级
            </label>
            <div className="relative">
              <input
                type="number"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={cn(
                  "w-full p-3 pl-10 rounded-lg transition-all duration-200",
                  "border-2 focus:ring-2 focus:outline-none",
                  "group-hover:shadow-md",
                  isDark 
                    ? "bg-slate-800/70 border-slate-700 text-slate-100 focus:border-sky-500 focus:ring-sky-500/20" 
                    : "bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500/30"
                )}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                Lv.
              </span>
            </div>
          </div>
          
          <div className="space-y-2 group animate-slideUpFade" style={{ animationDelay: '200ms' }}>
            <label className={cn(
              "block text-sm font-medium mb-1 transition-colors duration-200",
              "flex items-center gap-1.5",
              isDark ? "text-slate-300 group-hover:text-sky-300" : "text-slate-700 group-hover:text-blue-700"
            )}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
              等级经验
            </label>
            <div className="relative">
              <input
                type="number"
                value={levelPoints}
                onChange={(e) => setLevelPoints(e.target.value)}
                className={cn(
                  "w-full p-3 pl-10 rounded-lg transition-all duration-200",
                  "border-2 focus:ring-2 focus:outline-none",
                  "group-hover:shadow-md",
                  isDark 
                    ? "bg-slate-800/70 border-slate-700 text-slate-100 focus:border-sky-500 focus:ring-sky-500/20" 
                    : "bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500/30"
                )}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                XP
              </span>
            </div>
          </div>
          
          <div className="space-y-2 group animate-slideUpFade" style={{ animationDelay: '300ms' }}>
            <label className={cn(
              "block text-sm font-medium mb-1 transition-colors duration-200",
              "flex items-center gap-1.5",
              isDark ? "text-slate-300 group-hover:text-sky-300" : "text-slate-700 group-hover:text-blue-700"
            )}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
              </svg>
              青辉石
            </label>
            <div className="relative">
              <input
                type="number"
                value={blueCrystals}
                onChange={(e) => setBlueCrystals(e.target.value)}
                className={cn(
                  "w-full p-3 pl-10 rounded-lg transition-all duration-200",
                  "border-2 focus:ring-2 focus:outline-none",
                  "group-hover:shadow-md",
                  isDark 
                    ? "bg-slate-800/70 border-slate-700 text-slate-100 focus:border-sky-500 focus:ring-sky-500/20" 
                    : "bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500/30"
                )}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                💎
              </span>
            </div>
          </div>
          
          <div className="space-y-2 group animate-slideUpFade" style={{ animationDelay: '400ms' }}>
            <label className={cn(
              "block text-sm font-medium mb-1 transition-colors duration-200",
              "flex items-center gap-1.5",
              isDark ? "text-slate-300 group-hover:text-sky-300" : "text-slate-700 group-hover:text-blue-700"
            )}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              体力
            </label>
            <div className="relative">
              <input
                type="number"
                value={stamina}
                onChange={(e) => setStamina(e.target.value)}
                className={cn(
                  "w-full p-3 pl-10 rounded-lg transition-all duration-200",
                  "border-2 focus:ring-2 focus:outline-none",
                  "group-hover:shadow-md",
                  isDark 
                    ? "bg-slate-800/70 border-slate-700 text-slate-100 focus:border-sky-500 focus:ring-sky-500/20" 
                    : "bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500/30"
                )}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                ⚡
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center pt-2 animate-slideUpFade" style={{ animationDelay: '500ms' }}>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={cn(
              "px-6 py-3 rounded-full font-medium transition-all duration-300",
              "flex items-center justify-center gap-2",
              "transform hover:scale-105 active:scale-95",
              "shadow-md hover:shadow-lg",
              isSubmitting ? "opacity-70 cursor-not-allowed" : "opacity-100",
              isDark 
                ? "bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white" 
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            )}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                加载中...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                提交记录！
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}