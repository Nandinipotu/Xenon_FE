interface HistoryItem {
  id: string;
  date: string;
  sessionId: string | null;
  description: string;
  [key: string]: any;  
}

interface HistoryState {
  todayData: HistoryItem[];
  yesterdayData: HistoryItem[];
  lastSevenDays: HistoryItem[];
  lastThirtyDays: HistoryItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedHistory: string | null;
}
