export interface GameRecord {
  id: string;
  timestamp: number;
  date: string;
  level: number;
  levelPoints: number;
  blueCrystals: number;
  stamina: number;
}

export interface ComparisonData {
  level: { value: number; change: number; percentage: number };
  levelPoints: { value: number; change: number; percentage: number };
  blueCrystals: { value: number; change: number; percentage: number };
  stamina: { value: number; change: number; percentage: number };
}

export interface ChartDataPoint {
  date: string;
  time?: string;
  level: number;
  levelPoints: number;
  blueCrystals: number;
  stamina: number;
  [key: string]: string | number | undefined;
}

export interface RecordComparisonProps {
  currentRecord: GameRecord;
  comparedRecord: GameRecord | null;
  onSelectCompareRecord: (record: GameRecord | null) => void;
}