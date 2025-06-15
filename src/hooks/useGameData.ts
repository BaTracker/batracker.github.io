import { useState, useEffect } from 'react';
import { GameRecord } from '@/types';

const STORAGE_KEY = 'blue-archive-data';

export function useGameData() {
  const [records, setRecords] = useState<GameRecord[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setRecords(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = (data: GameRecord[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setRecords(data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addRecord = (record: Omit<GameRecord, 'id' | 'timestamp' | 'date'>) => {
    const now = new Date();
    const newRecord: GameRecord = {
      ...record,
      id: crypto.randomUUID(),
      timestamp: now.getTime(),
      date: now.toISOString().split('T')[0],
    };
    
    const updatedRecords = [newRecord, ...records];
    saveData(updatedRecords);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(records, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `blue-archive-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          saveData(importedData);
        }
      } catch (error) {
        console.error('Error importing data:', error);
      }
    };
    reader.readAsText(file);
  };

  return {
    records,
    addRecord,
    exportData,
    importData,
  };
}