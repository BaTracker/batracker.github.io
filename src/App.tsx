import { useSimpleGameData } from '@/hooks/useSimpleGameData';
import { useTheme } from '@/hooks/useTheme';
import { BasicForm } from '@/components/BasicForm';
import { BasicTable } from '@/components/BasicTable';
import { BasicStatus } from '@/components/BasicStatus';
import { BasicImportExport } from '@/components/BasicImportExport';
import { DataCharts } from '@/components/DataCharts';
import { RecordComparison } from '@/components/RecordComparison';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const { records, addRecord, exportData, importData, compareRecords, deleteRecord, clearAllData, editRecord } = useSimpleGameData();
  const { resolvedTheme, toggleTheme, isLoaded } = useTheme();
  const latestRecord = records.length > 0 ? records[0] : null;
  const isDark = resolvedTheme === 'dark';
  const [mounted, setMounted] = useState(false);
  
  // Ensure hydration completes before showing UI
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Animation states
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    if (mounted && isLoaded) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [mounted, isLoaded]);
  
  // Don't render anything until client-side hydration completes
  if (!mounted) return null;

  return (
    <div className={cn(
      "min-h-screen font-sans overflow-x-hidden",
      "bg-gradient-to-br",
      isDark 
        ? "from-slate-950 via-slate-900 to-slate-800 text-slate-50" 
        : "from-blue-50 via-indigo-50 to-sky-100 text-slate-800",
      showContent ? "opacity-100" : "opacity-0",
      "transition-all duration-500"
    )}>
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={cn(
          "absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20",
          isDark ? "bg-blue-600" : "bg-blue-400"
        )} />
        <div className={cn(
          "absolute top-1/3 -left-24 w-64 h-64 rounded-full blur-3xl opacity-20",
          isDark ? "bg-indigo-700" : "bg-indigo-400"
        )} />
        <div className={cn(
          "absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-20",
          isDark ? "bg-sky-600" : "bg-sky-300"
        )} />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Header with Theme Toggle */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 sm:mb-16">
          <div className="text-center sm:text-left mb-6 sm:mb-0 transform transition-all duration-700 ease-out">
            <h1 className={cn(
              "text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3",
              isDark ? "text-sky-400" : "text-blue-600",
              "animate-fadeIn",
              "flex items-center justify-center sm:justify-start gap-3"
            )}>
              <span className="animate-float inline-block">🎮</span> 
              <span className="relative">
                蔚蓝档案记录助手
              </span>
            </h1>
            <p className={cn(
              "text-sm sm:text-base lg:text-lg",
              isDark ? "text-sky-200" : "text-blue-500",
              "animate-slideUp"
            )}>
              追踪游戏进度，高效规划抽卡计划
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={cn(
                "p-3 rounded-full transition-all duration-200",
                "shadow-md hover:shadow-lg",
                "focus:outline-none focus:ring-2 focus:ring-opacity-50",
                isDark 
                  ? "bg-slate-800 hover:bg-slate-700 text-sky-400 focus:ring-sky-400 border border-slate-700" 
                  : "bg-white hover:bg-gray-50 text-blue-500 focus:ring-blue-500 border border-gray-200",
                "transform hover:scale-110 active:scale-95"
              )}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Current Status - Full Width */}
        <div className={cn(
          "transform transition-all duration-700 ease-out delay-100",
          showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          "mb-6"
        )}>
          <BasicStatus latestRecord={latestRecord} records={records} />
          
          {/* Data Charts - Moved under Current Status */}
          <div className={cn(
            "transform transition-all duration-700 ease-out delay-400 mt-6",
            showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}>
            <DataCharts records={records} />
          </div>
          
          {/* Record Comparison - Moved under Current Status */}
          <div className={cn(
            "transform transition-all duration-700 ease-out delay-500 mt-6",
            showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}>
            <RecordComparison records={records} compareRecords={compareRecords} />
          </div>
        </div>

        {/* Main content with grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left column - Stats and Form */}
          <div className="lg:col-span-5 space-y-6">
            {/* Data Input Form */}
            <div className={cn(
              "transform transition-all duration-700 ease-out delay-200",
              showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}>
              <BasicForm onSubmit={addRecord} />
            </div>
            
            {/* Import/Export */}
            <div className={cn(
              "transform transition-all duration-700 ease-out delay-400",
              showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}>
              <BasicImportExport onExport={exportData} onImport={importData} />
            </div>
          </div>
          
          {/* Right column - Table */}
          <div className="lg:col-span-7 space-y-6">            
            {/* Data Table */}
            <div className={cn(
              "transform transition-all duration-700 ease-out delay-300",
              showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}>
              <BasicTable 
                records={records} 
                onDeleteRecord={deleteRecord} 
                onEditRecord={editRecord}
                onClearAllData={clearAllData}
              />
            </div>
          </div>
          
          {/* This section was moved to under Current Status */}
        </div>

        {/* Footer */}
        <footer className={cn(
          "text-center mt-12 py-8 border-t",
          "transform transition-all duration-700 ease-out delay-500",
          showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          isDark ? "border-slate-800 text-slate-400" : "border-gray-200 text-slate-500"
        )}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <p>© 2025 蔚蓝档案记录助手</p>
            <div className="flex items-center">
              <span className="mx-2 text-sm">•</span>
              <p>用 <span className="text-red-500 animate-pulse-slow inline-block">❤️</span> 为蔚蓝档案玩家打造</p>
            </div>
          </div>
          <p className="text-xs mt-2 opacity-70">Version 1.0.0</p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
}

export default App;