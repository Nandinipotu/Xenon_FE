import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, Message } from '../../types/chat';
import { generateImage, generateQuestions } from '../../api/endpoints';
import { v4 as uuidv4 } from 'uuid';
import levenshtein from 'fast-levenshtein';



const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
  pendingMessageId: null, // Track the ID of the message we're waiting for
};




const isGenerate = (text: string): boolean => {
  const words = text.toLowerCase().split(/\s+/); // Split into words
  return words.some(word => levenshtein.get(word, 'generate') <= 2); // Allow up to 2 edits
};


export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ prompt, message, isNewChat, isEdit, editedMessageId }: 
    { prompt: string; message: string; isNewChat: boolean; isEdit?: boolean; editedMessageId?: string }, 
    { dispatch, rejectWithValue, getState }) => {    try {
      if (!isEdit) {
      const userMessageId = uuidv4();
      const userMessage: Message = {
        id: userMessageId,
        content: prompt,
        type: 'text',
        sender: 'user',
        timestamp: Date.now(),
      };
      dispatch(addUserMessage(userMessage));
      }

      if (isEdit && editedMessageId) {
        dispatch(removeResponsesAfterEdit(editedMessageId));
      }
      const pendingMessageId = uuidv4();
      dispatch(setPendingMessage(pendingMessageId));

      if (isGenerate(prompt)) {
        const imageData = await generateImage(prompt, isNewChat);

        return {
          messageId: pendingMessageId,
          content: 'Here is the generated image:',
          type: 'image' as const,
          imageUrl: imageData,
        };
      } else {
        // Pass both message and isNewChat to generateQuestions
        const questionResponse = await generateQuestions(message, isNewChat);

        return {
          messageId: pendingMessageId,
          content: questionResponse.response, // Extract the actual response text
          type: 'text' as const,
        };
      }
    } catch (error) {
      console.error('Error:', error);
      return rejectWithValue('Failed to process message');
    }
  }
);




export const retryMessage = createAsyncThunk(
  'chat/retryMessage',
  async ({ prompt, message, messageId, isNewChat }: { prompt: string; message: string; messageId: string, isNewChat: boolean }, 
    { dispatch, rejectWithValue }) => {
    try {
      // Set the pending message ID to the message we're retrying
      dispatch(setPendingMessage(messageId));
      
      // Handle "generate" case with Levenshtein distance
      if (isGenerate(prompt)) {
        const imageData = await generateImage(prompt, isNewChat);

        return {
          messageId,
          content: 'Here is the generated image:',
          type: 'image' as const,
          imageUrl: imageData,
        };
      } else {
        // Call `generateQuestions` API for all other cases
        const questionResponse = await generateQuestions(message,isNewChat);

        return {
          messageId,
          content: questionResponse,
          type: 'text' as const,
        };
      }
    } catch (error: any) {
      console.error('Error on retry:', error);
      return rejectWithValue({
        error: error.message || 'Failed to process message',
        status: error.status || 500,
        details: error.details || 'Unknown error'
      });
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
      state.pendingMessageId = null;
    },
    resetMessages: (state) => {
      state.messages = [];
      state.loading = false;
      state.error = null;
      state.pendingMessageId = null;
    },
    addUserMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setPendingMessage: (state, action: PayloadAction<string>) => {
      state.pendingMessageId = action.payload;
    },
    updateUserMessage: (state, action: PayloadAction<{id: string, content: string}>) => {
      const { id, content } = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg.id === id);
      
      if (messageIndex !== -1) {
        const message = state.messages[messageIndex];
        
        // Initialize edit history if it doesn't exist
        if (!message.editHistory) {
          message.editHistory = [];
        }
        
        // Add current content to history before updating
        message.editHistory.push({
          content: message.content,
          timestamp: Date.now()
        });
        
        // Update the content
        message.content = content;
        message.currentEditIndex = message.editHistory.length;
        
        // Remove all AI messages that came after this user message
        state.messages = state.messages.slice(0, messageIndex + 1);
      }
    },
    navigateEditHistory: (state, action: PayloadAction<{id: string, index: number}>) => {
      const { id, index } = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg.id === id);
      
      if (messageIndex !== -1) {
        const message = state.messages[messageIndex];
        
        if (message.editHistory) {
          // If navigating to the latest version
          if (index === message.editHistory.length) {
            message.content = message.editHistory[message.editHistory.length - 1].content;
          } else {
            // Otherwise show the historical version
            message.content = message.editHistory[index].content;
          }
          
          message.currentEditIndex = index;
        }
      }
    },
    removeResponsesAfterEdit: (state, action: PayloadAction<string>) => {
      const editedMessageId = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg.id === editedMessageId);
      
      if (messageIndex !== -1) {
        // Keep only messages up to and including the edited message
        state.messages = state.messages.slice(0, messageIndex + 1);
      }
    }

    
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        
        // Add AI message with the response
        const aiMessage: Message = {
          id: action.payload.messageId, // Use the ID we set earlier
          content: action.payload.content,
          type: action.payload.type,
          imageUrl: action.payload.type === 'image' ? action.payload.imageUrl : undefined,
          sender: 'ai',
          timestamp: Date.now(),
        };
        
        state.messages.push(aiMessage);
        state.pendingMessageId = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        
        const errorPayload = action.payload as { error: string, status: number, details: string };
        state.error = errorPayload?.error || 'An error occurred';
        
        // Add error message for the user to see in the chat
        if (state.pendingMessageId) {
          const errorMessageId = state.pendingMessageId;
          
          // Add the error message to the chat
          state.messages.push({
            id: errorMessageId,
            content: `Sorry, I encountered an error: ${errorPayload?.error || 'Unknown error'}. Please try again.`,
            type: 'text',
            sender: 'ai',
            timestamp: Date.now(),
            isError: true, // Flag to identify this as an error message for styling
            originalRequest: action.meta.arg.prompt, // Store the original prompt for retry
          });
          
          state.pendingMessageId = null;
        }
      })
      // Handle retry cases
      .addCase(retryMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
        
        // Find and remove the error message we're retrying
        if (state.pendingMessageId) {
          state.messages = state.messages.filter(msg => msg.id !== state.pendingMessageId);
        }
      })
      .addCase(retryMessage.fulfilled, (state, action) => {
        state.loading = false;
        
        // Add AI message with the response
        const aiMessage: Message = {
          id: action.payload.messageId,
          content: action.payload.content,
          type: action.payload.type,
          imageUrl: action.payload.type === 'image' ? action.payload.imageUrl : undefined,
          sender: 'ai',
          timestamp: Date.now(),
        };
        
        state.messages.push(aiMessage);
        state.pendingMessageId = null;
      })
      .addCase(retryMessage.rejected, (state, action) => {
        state.loading = false;
        
        // Store the error details
        const errorPayload = action.payload as { error: string, status: number, details: string };
        state.error = errorPayload?.error || 'An error occurred';
        
        // Add error message for the user to see in the chat
        if (state.pendingMessageId) {
          const errorMessageId = state.pendingMessageId;
          
          // Add the error message to the chat
          state.messages.push({
            id: errorMessageId,
            content: `Still having trouble: ${errorPayload?.error || 'Unknown error'}. Please try again later.`,
            type: 'text',
            sender: 'ai',
            timestamp: Date.now(),
            isError: true,
            originalRequest: action.meta.arg.prompt,
          });
          
          state.pendingMessageId = null;
        }
      });
  },
});

export const { clearChat, resetMessages, addUserMessage, setPendingMessage, updateUserMessage, removeResponsesAfterEdit, navigateEditHistory } = chatSlice.actions;
export default chatSlice.reducer;