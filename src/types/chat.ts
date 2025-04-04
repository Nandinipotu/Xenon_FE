// In types/chat.ts
export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image';
  imageUrl?: string;
  sender: 'user' | 'ai';
  timestamp: number;
  isLoading?: boolean;
  sessionId?: string; // Add this line to store the sessionId for each message
  editHistory?: {
    content: string;
    timestamp: number;
  }[];
  currentEditIndex?: number;
  isError?: boolean;
  originalRequest?: string;
  paginationData?: {
    newQuestions: string[];
    newAnswers: string[];
    currentIndex: number;
    totalCount: number;
  }; // Add this to handle pagination data
}
 
export interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  pendingMessageId: string | null;
  editLoading: boolean;
  editResponseId: string | null;
}