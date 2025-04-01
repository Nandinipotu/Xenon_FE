export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image';
  imageUrl?: string;
  sender: 'user' | 'ai';
  timestamp: number;
  editHistory?: {
    content: string;
    timestamp: number;
  }[];
  currentEditIndex?: number;
  isError?: boolean; 
  originalRequest?: string;
}

export interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  pendingMessageId: string | null; 
}


