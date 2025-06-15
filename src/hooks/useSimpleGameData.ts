import { useState, useEffect } from 'react';
import { GameRecord } from '@/types';

const STORAGE_KEY = 'blue-archive-data';
const MAX_RECORDS = 500; // Limit to prevent memory issues

export function useSimpleGameData() {
  const [records, setRecords] = useState<GameRecord[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (Array.isArray(data)) {
          // Limit records to prevent memory issues
          const limitedData = data.slice(0, MAX_RECORDS);
          setRecords(limitedData);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setRecords([]);
    }
  };

  const saveData = (data: GameRecord[]) => {
    try {
      // Limit records to prevent memory issues
      const limitedData = data.slice(0, MAX_RECORDS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedData));
      setRecords(limitedData);
    } catch (error) {
      console.error('Error saving data:', error);
      // If storage is full, try to save with fewer records
      try {
        const reducedData = data.slice(0, 100);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedData));
        setRecords(reducedData);
        alert('存储空间已满。仅保留最新的100条记录。');
      } catch (e) {
        console.error('Failed to save even reduced data:', e);
        alert('无法保存数据。存储空间可能已满。');
      }
    }
  };

  const addRecord = (record: Omit<GameRecord, 'id' | 'timestamp' | 'date'>) => {
    const now = new Date();
    const newRecord: GameRecord = {
      ...record,
      id: now.getTime().toString(), // Use timestamp as ID to avoid crypto.randomUUID()
      timestamp: now.getTime(),
      date: now.toISOString().split('T')[0],
    };
    
    const updatedRecords = [newRecord, ...records];
    saveData(updatedRecords);
  };
  
  const deleteRecord = (id: string) => {
    const updatedRecords = records.filter(record => record.id !== id);
    saveData(updatedRecords);
  };

  // 新增：清空所有数据
  const clearAllData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setRecords([]);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  };

  // 新增：编辑记录
  const editRecord = (id: string, updatedData: Partial<Omit<GameRecord, 'id'>>) => {
    const recordIndex = records.findIndex(record => record.id === id);
    if (recordIndex === -1) return false;
    
    const updatedRecords = [...records];
    updatedRecords[recordIndex] = {
      ...updatedRecords[recordIndex],
      ...updatedData,
      // 如果更新了timestamp，需要同时更新date
      ...(updatedData.timestamp ? {
        date: new Date(updatedData.timestamp).toISOString().split('T')[0]
      } : {})
    };
    
    saveData(updatedRecords);
    return true;
  };

  const exportData = () => {
    try {
      const dataStr = JSON.stringify(records, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `blue-archive-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('导出失败。请重试。');
    }
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          saveData(importedData);
          // 返回成功状态，让组件处理通知
          return true;
        } else {
          // 返回错误状态，让组件处理通知
          return false;
        }
      } catch (error) {
        console.error('Import failed:', error);
        // 返回错误状态，让组件处理通知
        return false;
      }
    };
    reader.readAsText(file);
    // 默认返回true，实际结果由reader.onload处理
    return true;
  };

  // 比较两条记录并返回差异数据
  const compareRecords = (currentRecord: GameRecord, previousRecord: GameRecord) => {
    return {
      level: { 
        value: currentRecord.level, 
        change: currentRecord.level - previousRecord.level,
        percentage: previousRecord.level > 0 ? ((currentRecord.level - previousRecord.level) / previousRecord.level) * 100 : 0
      },
      levelPoints: { 
        value: currentRecord.levelPoints, 
        change: currentRecord.levelPoints - previousRecord.levelPoints,
        percentage: previousRecord.levelPoints > 0 ? ((currentRecord.levelPoints - previousRecord.levelPoints) / previousRecord.levelPoints) * 100 : 0
      },
      blueCrystals: { 
        value: currentRecord.blueCrystals, 
        change: currentRecord.blueCrystals - previousRecord.blueCrystals,
        percentage: previousRecord.blueCrystals > 0 ? ((currentRecord.blueCrystals - previousRecord.blueCrystals) / previousRecord.blueCrystals) * 100 : 0
      },
      stamina: { 
        value: currentRecord.stamina, 
        change: currentRecord.stamina - previousRecord.stamina,
        percentage: previousRecord.stamina > 0 ? ((currentRecord.stamina - previousRecord.stamina) / previousRecord.stamina) * 100 : 0
      }
    };
  };

  return {
    records,
    addRecord,
    deleteRecord,
    exportData,
    importData,
    compareRecords,
    clearAllData, // 新增：清空数据功能
    editRecord,   // 新增：编辑记录功能
  };
}
