import { useRef, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface BasicImportExportProps {
  onExport: () => void;
  onImport: (file: File) => void;
}

export function BasicImportExport({ onExport, onImport }: BasicImportExportProps) {
  const { resolvedTheme } = useTheme();
  const { toast } = useToast();
  const isDark = resolvedTheme === 'dark';
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExportClick = async () => {
    setIsExporting(true);
    // Add a small delay to show loading animation
    await new Promise(resolve => setTimeout(resolve, 300));
    onExport();
    setIsExporting(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsImporting(true);
      // Add a small delay to show loading animation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      try {
        onImport(file);
        
        // 使用toast通知代替alert
        toast({
          title: "导入成功",
          description: "数据已成功导入！",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "导入失败",
          description: "导入过程中发生错误，请重试。",
          variant: "destructive",
        });
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsImporting(false);
    }
  };

  return (
    <div 
      className={cn(
        "rounded-xl p-6 mb-6 transition-all duration-300",
        "border shadow-md hover:shadow-lg",
        "animate-fadeIn",
        isDark 
          ? "bg-slate-900/80 border-slate-800 text-slate-100 backdrop-blur-sm" 
          : "bg-white/90 border-slate-200 text-slate-900 backdrop-blur-sm"
      )}
    >
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
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" 
              />
            </svg>
          </span>
          <span>
            数据管理
          </span>
        </h2>
        

      </div>
      <div className="flex flex-col space-y-4 animate-slideUpFade">
        <button
          onClick={handleExportClick}
          disabled={isExporting}
          className={cn(
            "px-6 py-3 rounded-full font-medium transition-all duration-300",
            "flex items-center justify-center gap-2",
            "transform hover:scale-105 active:scale-95",
            "shadow-md hover:shadow-lg",
            isExporting ? "opacity-70 cursor-not-allowed" : "opacity-100",
            isDark 
              ? "bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white" 
              : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          )}
        >
          {isExporting ? (
            <>
              <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>导出中...</span>
            </>
          ) : (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" 
                />
              </svg>
              <span>导出数据</span>
            </>
          )}
        </button>
        <button
          onClick={handleImportClick}
          disabled={isImporting}
          className={cn(
            "px-6 py-3 rounded-full font-medium transition-all duration-300",
            "flex items-center justify-center gap-2",
            "transform hover:scale-105 active:scale-95",
            "shadow-md hover:shadow-lg",
            isImporting ? "opacity-70 cursor-not-allowed" : "opacity-100",
            isDark 
              ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white" 
              : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
          )}
        >
          {isImporting ? (
            <>
              <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>导入中...</span>
            </>
          ) : (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                />
              </svg>
              <span>导入数据</span>
            </>
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".json"
        />
      </div>
    </div>
  );
}