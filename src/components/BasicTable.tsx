import { useState, useMemo, useCallback } from 'react';
import { GameRecord } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Trash2Icon, PencilIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ComparisonData } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';

// 编辑表单的验证模式
const formSchema = z.object({
  level: z.coerce.number().min(1, '等级必须大于0'),
  levelPoints: z.coerce.number().min(0, '等级经验不能为负数'),
  blueCrystals: z.coerce.number().min(0, '青辉石不能为负数'),
  stamina: z.coerce.number().min(0, '体力不能为负数'),
  timestamp: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

// 比较指示器组件
function ComparisonIndicator({ value, isDark, format = false }: { value: { change: number; percentage: number }; isDark: boolean; format?: boolean }) {
  if (value.change === 0) return null;
  
  const isPositive = value.change > 0;
  const displayValue = format ? value.change.toLocaleString() : value.change;
  const percentageDisplay = Math.abs(value.percentage).toFixed(1);
  
  return (
    <div className={cn(
      "flex items-center mt-1 text-xs font-medium",
      isPositive 
        ? isDark ? "text-green-400" : "text-green-600"
        : isDark ? "text-red-400" : "text-red-600"
    )}>
      {isPositive ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
        </svg>
      )}
      <span>{isPositive ? '+' : ''}{displayValue} ({isPositive ? '+' : ''}{percentageDisplay}%)</span>
    </div>
  );
}

interface BasicTableProps {
  records: GameRecord[];
  onDeleteRecord?: (id: string) => void;
  onEditRecord?: (id: string, data: Partial<Omit<GameRecord, 'id'>>) => boolean;
  onClearAllData?: () => boolean;
}

export function BasicTable({ records, onDeleteRecord, onEditRecord, onClearAllData }: BasicTableProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // 状态管理
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [comparingRecord, setComparingRecord] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditRecord, setCurrentEditRecord] = useState<GameRecord | null>(null);
  
  // 编辑表单
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: 1,
      levelPoints: 0,
      blueCrystals: 0,
      stamina: 0,
      timestamp: Date.now(),
    },
  });

  // 按日期分组记录
  const recordsByDate = useMemo(() => {
    const grouped: Record<string, GameRecord[]> = {};
    
    records.forEach(record => {
      if (!grouped[record.date]) {
        grouped[record.date] = [];
      }
      grouped[record.date].push(record);
    });
    
    return Object.entries(grouped)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .map(([date, records]) => ({
        date,
        records,
      }));
  }, [records]);
  
  // 处理比较逻辑
  const getComparisonData = useCallback((currentId: string): ComparisonData | null => {
    if (!comparingRecord || comparingRecord === currentId) return null;
    
    const current = records.find(r => r.id === currentId);
    const compared = records.find(r => r.id === comparingRecord);
    
    if (!current || !compared) return null;
    
    return {
      level: { 
        value: current.level, 
        change: current.level - compared.level,
        percentage: compared.level > 0 ? ((current.level - compared.level) / compared.level) * 100 : 0
      },
      levelPoints: { 
        value: current.levelPoints, 
        change: current.levelPoints - compared.levelPoints,
        percentage: compared.levelPoints > 0 ? ((current.levelPoints - compared.levelPoints) / compared.levelPoints) * 100 : 0
      },
      blueCrystals: { 
        value: current.blueCrystals, 
        change: current.blueCrystals - compared.blueCrystals,
        percentage: compared.blueCrystals > 0 ? ((current.blueCrystals - compared.blueCrystals) / compared.blueCrystals) * 100 : 0
      },
      stamina: { 
        value: current.stamina, 
        change: current.stamina - compared.stamina,
        percentage: compared.stamina > 0 ? ((current.stamina - compared.stamina) / compared.stamina) * 100 : 0
      }
    };
  }, [comparingRecord, records]);
  
  // 处理删除记录
  const handleDelete = (id: string) => {
    if (onDeleteRecord) {
      onDeleteRecord(id);
    }
  };
  
  // 处理清空所有数据
  const handleClearAllData = () => {
    if (onClearAllData && window.confirm('确定要清空所有数据吗？此操作不可恢复。')) {
      onClearAllData();
    }
  };
  
  // 处理编辑记录
  const handleEditClick = (record: GameRecord) => {
    setCurrentEditRecord(record);
    form.reset({
      level: record.level,
      levelPoints: record.levelPoints,
      blueCrystals: record.blueCrystals,
      stamina: record.stamina,
      timestamp: record.timestamp,
    });
    setEditDialogOpen(true);
  };
  
  // 提交编辑表单
  const onSubmit = (values: FormValues) => {
    if (currentEditRecord && onEditRecord) {
      const success = onEditRecord(currentEditRecord.id, values);
      if (success) {
        setEditDialogOpen(false);
        setCurrentEditRecord(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* 记录总数和清空数据按钮 */}
      <div className="flex justify-between items-center">
        <div className={cn(
          "text-sm font-medium",
          isDark ? "text-slate-400" : "text-slate-600"
        )}>
          共 {records.length} 条记录
        </div>
        {onClearAllData && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleClearAllData}
            className="flex items-center gap-1"
          >
            <Trash2Icon className="h-4 w-4" />
            清空数据
          </Button>
        )}
      </div>
      
      {/* 无记录提示 */}
      {records.length === 0 ? (
        <div className={cn(
          "p-8 text-center rounded-xl",
          "animate-slideUpFade duration-500",
          isDark 
            ? "bg-slate-800/70 text-slate-400" 
            : "bg-slate-50/80 text-slate-500"
        )}>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center",
              "animate-pulse-slow",
              isDark ? "bg-slate-700/50" : "bg-slate-200/70"
            )}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className={cn(
                "text-xl font-semibold mb-2",
                isDark ? "text-slate-300" : "text-slate-600"
              )}>无记录</p>
              <p className="text-sm max-w-md mx-auto">添加新记录以开始追踪进度</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* 按日期分组的记录 */}
          {recordsByDate.map(({ date, records }, groupIndex) => (
            <Collapsible
              key={date}
              open={openSections[date]}
              onOpenChange={(open) => setOpenSections({ ...openSections, [date]: open })}
              className={cn(
                "rounded-xl border shadow-md hover:shadow-lg transition-all duration-300",
                "animate-slideUpFade",
                isDark 
                  ? "bg-slate-800/70 border-slate-700" 
                  : "bg-white/80 border-slate-200"
              )}
              style={{ animationDelay: `${groupIndex * 70 + 100}ms` }}
            >
              <CollapsibleTrigger className="w-full">
                <div className={cn(
                  "p-4 flex items-center justify-between",
                  "cursor-pointer",
                  isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                )}>
                  <div className={cn(
                    "text-sm rounded-full px-3 py-1.5 font-medium",
                    "flex items-center gap-1.5",
                    isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-700"
                  )}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {date}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      isDark ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-600"
                    )}>
                      {records.length} 条记录
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={cn(
                        "h-5 w-5 transition-transform duration-300",
                        openSections[date] ? "transform rotate-180" : "",
                        isDark ? "text-slate-400" : "text-slate-600"
                      )} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="p-4 space-y-4">
                  {records.map((record, recordIndex) => {
                    const isComparing = comparingRecord === record.id;
                    const comparison = getComparisonData(record.id);
                    
                    return (
                      <div 
                        key={record.id} 
                        className={cn(
                          "relative p-4 rounded-xl border transition-all duration-300",
                          "animate-slideUpFade",
                          isDark 
                            ? isComparing ? "bg-blue-900/10 border-blue-800/30" : "bg-slate-700/30 border-slate-600/30" 
                            : isComparing ? "bg-blue-50 border-blue-100" : "bg-white/90 border-slate-200/70"
                        )}
                        style={{ animationDelay: `${recordIndex * 50 + 150}ms` }}
                      >
                        {/* 操作按钮 */}
                        <div className="absolute top-3 right-3 flex space-x-1 z-10">
                          {/* 编辑按钮 */}
                          {onEditRecord && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-7 w-7 rounded-full",
                                isDark ? "hover:bg-slate-700/70 text-slate-300" : "hover:bg-slate-100 text-slate-600"
                              )}
                              onClick={() => handleEditClick(record)}
                            >
                              <PencilIcon className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          
                          {/* 删除按钮 */}
                          {onDeleteRecord && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-7 w-7 rounded-full",
                                isDark ? "hover:bg-red-900/20 text-red-300" : "hover:bg-red-50 text-red-500"
                              )}
                              onClick={() => handleDelete(record.id)}
                            >
                              <Trash2Icon className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          
                          {/* 比较按钮 */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-7 px-2.5 text-xs rounded-full",
                              isComparing
                                ? isDark
                                  ? "bg-blue-900/30 text-blue-300 hover:bg-blue-900/40"
                                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                : isDark
                                  ? "text-slate-300 hover:bg-slate-700/70"
                                  : "text-slate-600 hover:bg-slate-100"
                            )}
                            onClick={() => setComparingRecord(isComparing ? null : record.id)}
                          >
                            {isComparing ? "取消比较" : "比较"}
                          </Button>
                        </div>
                        
                        {/* 时间显示 */}
                        <div className={cn(
                          "text-xs font-medium mb-3 flex items-center gap-1.5",
                          isDark ? "text-slate-400" : "text-slate-500"
                        )}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {format(new Date(record.timestamp), 'HH:mm:ss')}
                        </div>
                        
                        {/* 记录数据 */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className={cn(
                            "p-3 rounded-xl transition-all duration-300",
                            "border shadow-sm hover:shadow-md",
                            isDark 
                              ? isComparing ? "bg-blue-900/20 border-blue-800/30" : "bg-slate-800/70 border-slate-700/50" 
                              : isComparing ? "bg-blue-50 border-blue-100" : "bg-white/90 border-slate-200/70"
                          )}>
                            <div className="flex flex-col">
                              <div className="flex items-center justify-between mb-1">
                                <span className={cn(
                                  "text-xs font-medium flex items-center gap-1",
                                  isDark ? "text-slate-400" : "text-slate-500"
                                )}>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V4z" clipRule="evenodd" />
                                  </svg>
                                  等级
                                </span>
                              </div>
                              <span className={cn(
                                "text-xl font-bold",
                                isDark 
                                  ? isComparing ? "text-blue-400" : "text-slate-200" 
                                  : isComparing ? "text-blue-700" : "text-slate-900"
                              )}>{record.level}</span>
                              {comparison && (
                                <ComparisonIndicator value={comparison.level} isDark={isDark} />
                              )}
                            </div>
                          </div>
                          
                          <div className={cn(
                            "p-3 rounded-xl transition-all duration-300",
                            "border shadow-sm hover:shadow-md",
                            isDark 
                              ? isComparing ? "bg-blue-900/20 border-blue-800/30" : "bg-slate-800/70 border-slate-700/50" 
                              : isComparing ? "bg-blue-50 border-blue-100" : "bg-white/90 border-slate-200/70"
                          )}>
                            <div className="flex flex-col">
                              <div className="flex items-center justify-between mb-1">
                                <span className={cn(
                                  "text-xs font-medium flex items-center gap-1",
                                  isDark ? "text-slate-400" : "text-slate-500"
                                )}>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                                  </svg>
                                  等级经验
                                </span>
                              </div>
                              <span className={cn(
                                "text-xl font-bold",
                                isDark 
                                  ? isComparing ? "text-purple-400" : "text-slate-200" 
                                  : isComparing ? "text-purple-700" : "text-slate-900"
                              )}>{record.levelPoints}</span>
                              {comparison && (
                                <ComparisonIndicator value={comparison.levelPoints} isDark={isDark} />
                              )}
                            </div>
                          </div>
                          
                          <div className={cn(
                            "p-3 rounded-xl transition-all duration-300",
                            "border shadow-sm hover:shadow-md",
                            isDark 
                              ? isComparing ? "bg-blue-900/20 border-blue-800/30" : "bg-slate-800/70 border-slate-700/50" 
                              : isComparing ? "bg-blue-50 border-blue-100" : "bg-white/90 border-slate-200/70"
                          )}>
                            <div className="flex flex-col">
                              <div className="flex items-center justify-between mb-1">
                                <span className={cn(
                                  "text-xs font-medium flex items-center gap-1",
                                  isDark ? "text-slate-400" : "text-slate-500"
                                )}>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                                    <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                                    <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                                  </svg>
                                  青辉石
                                </span>
                              </div>
                              <span className={cn(
                                "text-xl font-bold",
                                isDark 
                                  ? isComparing ? "text-cyan-400" : "text-slate-200" 
                                  : isComparing ? "text-cyan-700" : "text-slate-900"
                              )}>{record.blueCrystals.toLocaleString()}</span>
                              {comparison && (
                                <ComparisonIndicator value={comparison.blueCrystals} isDark={isDark} format={true} />
                              )}
                            </div>
                          </div>
                          
                          <div className={cn(
                            "p-3 rounded-xl transition-all duration-300",
                            "border shadow-sm hover:shadow-md",
                            isDark 
                              ? isComparing ? "bg-blue-900/20 border-blue-800/30" : "bg-slate-800/70 border-slate-700/50" 
                              : isComparing ? "bg-blue-50 border-blue-100" : "bg-white/90 border-slate-200/70"
                          )}>
                            <div className="flex flex-col">
                              <div className="flex items-center justify-between mb-1">
                                <span className={cn(
                                  "text-xs font-medium flex items-center gap-1",
                                  isDark ? "text-slate-400" : "text-slate-500"
                                )}>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                  </svg>
                                  体力
                                </span>
                              </div>
                              <span className={cn(
                                "text-xl font-bold",
                                isDark 
                                  ? isComparing ? "text-green-400" : "text-slate-200" 
                                  : isComparing ? "text-green-700" : "text-slate-900"
                              )}>{record.stamina}</span>
                              {comparison && (
                                <ComparisonIndicator value={comparison.stamina} isDark={isDark} />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
      
      {/* 编辑记录对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className={cn(
          "sm:max-w-md",
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
          <DialogHeader>
            <DialogTitle className={cn(
              "text-xl font-bold",
              isDark ? "text-sky-400" : "text-blue-600"
            )}>编辑记录</DialogTitle>
            <DialogDescription className={cn(
              isDark ? "text-slate-400" : "text-slate-500"
            )}>
              修改记录信息，点击保存应用更改。
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(
                      "font-medium",
                      isDark ? "text-slate-300" : "text-slate-700"
                    )}>等级</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className={cn(
                          isDark 
                            ? "bg-slate-800 border-slate-700 text-slate-200 focus-visible:ring-sky-400/20" 
                            : "bg-white border-slate-200 text-slate-900 focus-visible:ring-blue-500/20"
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="levelPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(
                      "font-medium",
                      isDark ? "text-slate-300" : "text-slate-700"
                    )}>等级经验</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className={cn(
                          isDark 
                            ? "bg-slate-800 border-slate-700 text-slate-200 focus-visible:ring-sky-400/20" 
                            : "bg-white border-slate-200 text-slate-900 focus-visible:ring-blue-500/20"
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="blueCrystals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(
                      "font-medium",
                      isDark ? "text-slate-300" : "text-slate-700"
                    )}>青辉石</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className={cn(
                          isDark 
                            ? "bg-slate-800 border-slate-700 text-slate-200 focus-visible:ring-sky-400/20" 
                            : "bg-white border-slate-200 text-slate-900 focus-visible:ring-blue-500/20"
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stamina"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(
                      "font-medium",
                      isDark ? "text-slate-300" : "text-slate-700"
                    )}>体力</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className={cn(
                          isDark 
                            ? "bg-slate-800 border-slate-700 text-slate-200 focus-visible:ring-sky-400/20" 
                            : "bg-white border-slate-200 text-slate-900 focus-visible:ring-blue-500/20"
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timestamp"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className={cn(
                      "font-medium",
                      isDark ? "text-slate-300" : "text-slate-700"
                    )}>日期</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value ? new Date(field.value) : undefined}
                        setDate={(date) => field.onChange(date ? date.getTime() : Date.now())}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button 
                  type="submit"
                  className={cn(
                    "transition-all duration-300",
                    isDark 
                      ? "bg-sky-600 text-white hover:bg-sky-700" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  保存更改
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};