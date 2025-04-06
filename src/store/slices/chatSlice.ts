import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, Message } from '../../types/chat';
import { generateImage, generateQuestions } from '../../api/endpoints';
import { v4 as uuidv4 } from 'uuid';
import levenshtein from 'fast-levenshtein';
import axiosInstance from 'api/axiosInstance';
import { RootState } from 'store';
 
 
 
 
const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
  pendingMessageId: null,
  editLoading: false, // Add this to track edit loading state
  editResponseId: null, // Track the ID of the response being edited
};
 
 
 
 
const isGenerate = (text: string): boolean => {
  const words = text.toLowerCase().split(/\s+/); // Split into words
  return words.some(word => levenshtein.get(word, 'generate') <= 2); // Allow up to 2 edits
};
 
 
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ prompt, message, isNewChat, isEdit, editedMessageId }:
    { prompt: string; message: string; isNewChat: boolean; isEdit?: boolean; editedMessageId?: string },
    { dispatch, rejectWithValue, getState }) => {
    try {
      const chatState = (getState() as RootState).chat;      
      const isFirstMessage = chatState.messages.length === 0;
     
      isNewChat = isFirstMessage;
     
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
        // Pass the correctly calculated isNewChat to generateQuestions
        const questionResponse = await generateQuestions(message, isNewChat);
 
        return {
          messageId: pendingMessageId,
          content: questionResponse.response,
          type: 'text' as const,
          sessionId: questionResponse.sessionId,
        };
      }
    } catch (error) {
      console.error('Error:', error);
      return rejectWithValue('Failed to process message');
    }
  }
);
 
// Add a new action for handling edit API requests
export const editUserQuestion = createAsyncThunk(
  'chat/editUserQuestion',
  async ({ sessionId, newQuestion, messageId }:
    { sessionId: string; newQuestion: string; messageId: string },
    { dispatch, rejectWithValue }) => {
    try {
      // Call the edit API
      const response = await axiosInstance.put(
        `/history/edit-question?sessionId=${encodeURIComponent(sessionId)}&newQuestion=${encodeURIComponent(newQuestion)}`
      );
 
      // Log the full response to debug
      console.log('Edit API raw response:', response);
     
      // Check if we have valid data
      if (!response.data || !response.data.data) {
        return rejectWithValue('Invalid response from edit API');
      }
 
      // Return all the data we need
      return {
        messageId,
        editedData: response.data.data,
        newQuestion,
        sessionId
      };
    } catch (error) {
      console.error('Error editing question:', error);
      return rejectWithValue('Failed to edit question');
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
      state.editLoading = false;
      state.editResponseId = null;
    },
    resetMessages: (state) => {
      state.messages = [];
      state.loading = false;
      state.error = null;
      state.pendingMessageId = null;
      state.editLoading = false;
      state.editResponseId = null;
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
      }
    },
    setEditLoading: (state, action: PayloadAction<{messageId: string, responseId: string}>) => {
      const { messageId, responseId } = action.payload;
     
      // Update the user message
      const messageIndex = state.messages.findIndex(msg => msg.id === messageId);
      if (messageIndex !== -1) {
        // Find the response message (usually the next one)
        const responseIndex = state.messages.findIndex(msg => msg.id === responseId);
        if (responseIndex !== -1) {
          // Mark the response as loading
          state.messages[responseIndex].isLoading = true;
          state.editResponseId = responseId;
          state.editLoading = true;
        }
      }
    },
    // Add new reducer for pagination navigation
    navigatePagination: (state, action: PayloadAction<{id: string, direction: 'next' | 'prev'}>) => {
      const { id, direction } = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg.id === id);
     
      if (messageIndex !== -1 && state.messages[messageIndex].paginationData) {
        const message = state.messages[messageIndex];
        const paginationData = message.paginationData!;
       
        // Calculate new index based on direction
        let newIndex = paginationData.currentIndex;
        if (direction === 'next' && newIndex < paginationData.totalCount - 1) {
          newIndex++;
        } else if (direction === 'prev' && newIndex > 0) {
          newIndex--;
        }
       
        // Update current index
        paginationData.currentIndex = newIndex;
       
        // Update user message content to show the current question
        message.content = paginationData.newQuestions[newIndex];
       
        // Update AI message content (if it exists)
        if (messageIndex + 1 < state.messages.length) {
          const aiMessage = state.messages[messageIndex + 1];
          if (paginationData.newAnswers && paginationData.newAnswers.length > newIndex) {
            aiMessage.content = paginationData.newAnswers[newIndex];
          }
        }
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
          sessionId: action.payload.sessionId, // Include sessionId in the AI message
        };
       
        state.messages.push(aiMessage);
        state.pendingMessageId = null;
 
        // Also add the sessionId to the previous user message
        if (state.messages.length >= 2) {
          const lastUserMessageIndex = state.messages.length - 2;
          if (state.messages[lastUserMessageIndex].sender === 'user') {
            state.messages[lastUserMessageIndex].sessionId = action.payload.sessionId;
          }
        }
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
      })
      // .addCase(editUserQuestion.fulfilled, (state, action) => {
      //   const { messageId, editedData, newQuestion } = action.payload;
      //   const messageIndex = state.messages.findIndex(msg => msg.id === messageId);
       
      //   if (messageIndex !== -1) {
      //     const userMessage = state.messages[messageIndex];
      //     const aiMessage = messageIndex + 1 < state.messages.length ? state.messages[messageIndex + 1] : null;
         
      //     // Update the message with the edited content
      //     userMessage.content = newQuestion;
         
      //     // Create pagination data structure
      //     const newQuestions = [editedData.questionAnswer[0].question, ...editedData.questionAnswer[0].newquestion];
      //     const newAnswers = [editedData.questionAnswer[0].answer, ...editedData.questionAnswer[0].newanswer];
         
      //     // Add pagination data to user message
      //     userMessage.paginationData = {
      //       newQuestions,
      //       newAnswers,
      //       currentIndex: editedData.currentQuestionIndex 0,
      //       totalCount: editedData.count || newQuestions.length
      //     };
         
      //     // Update AI response message if it exists
      //     if (aiMessage) {
      //       aiMessage.content = editedData.questionAnswer[0].answer;
      //       if (editedData.questionAnswer[0].newanswer && editedData.questionAnswer[0].newanswer.length > 0) {
      //         aiMessage.content = editedData.questionAnswer[0].newanswer[0];
      //       }
      //     }
      //   }
      // })
      .addCase(editUserQuestion.pending, (state, action) => {
        state.editLoading = true;
       
        // Find the message and set loading UI
        const messageId = action.meta.arg.messageId;
        const messageIndex = state.messages.findIndex(msg => msg.id === messageId);
       
        if (messageIndex !== -1) {
          // Update the user message immediately with the new question
          state.messages[messageIndex].content = action.meta.arg.newQuestion;
         
          // Find the associated AI response message (usually next one)
          if (messageIndex + 1 < state.messages.length) {
            const responseId = state.messages[messageIndex + 1].id;
            state.editResponseId = responseId;
           
            // Set the AI response to loading state
            state.messages[messageIndex + 1].isLoading = true;
            // We can also set a loading placeholder text if desired
            state.messages[messageIndex + 1].content = "Loading...";
          }
        }
      })
     
      // .addCase(editUserQuestion.fulfilled, (state, action) => {
      //   state.editLoading = false;
      //   state.editResponseId = null;
       
      //   const { messageId, editedData, newQuestion, sessionId } = action.payload;
      //   const messageIndex = state.messages.findIndex(msg => msg.id === messageId);
       
      //   if (messageIndex !== -1 && editedData) {
      //     const userMessage = state.messages[messageIndex];
      //     const aiMessageIndex = messageIndex + 1;
      //     const aiMessage = aiMessageIndex < state.messages.length ? state.messages[aiMessageIndex] : null;
         
      //     // Initialize the arrays for pagination
      //     let newQuestions = [newQuestion];  // Default to just the edited question
      //     let newAnswers = [];  // Empty initially
         
      //     // Handle different possible response structures
      //     if (editedData.questionAnswer && editedData.questionAnswer.length > 0) {
      //       const qa = editedData.questionAnswer[0];
           
      //       // Add original Q&A
      //       if (qa.question) newQuestions[0] = qa.question;
      //       if (qa.answer) newAnswers[0] = qa.answer;
           
      //       // Add new questions and answers if they exist
      //       if (qa.newquestion && Array.isArray(qa.newquestion)) {
      //         newQuestions = newQuestions.concat(qa.newquestion);
      //       }
           
      //       if (qa.newanswer && Array.isArray(qa.newanswer)) {
      //         newAnswers = newAnswers.concat(qa.newanswer);
      //       }
      //     } else if (editedData.currentQA) {
      //       // Alternative structure
      //       if (editedData.currentQA.question) newQuestions[0] = editedData.currentQA.question;
      //       if (editedData.currentQA.answer) newAnswers[0] = editedData.currentQA.answer;
      //     }
         
      //     // This is the key change: Use the currentIndex from the response or default to 0
      //     const currentIndex = editedData.currentQuestionIndex || 0;
         
      //     // Add pagination data to user message
      //     userMessage.paginationData = {
      //       newQuestions,
      //       newAnswers,
      //       currentIndex: currentIndex,
      //       totalCount: editedData.count || newQuestions.length
      //     };
         
      //     // Update the session ID if it's not already set
      //     if (!userMessage.sessionId) {
      //       userMessage.sessionId = sessionId;
      //     }
         
      //     // Update AI response message if it exists
      //     if (aiMessage && newAnswers.length > 0) {
      //       // Get the answer at the current index instead of always showing the first one
      //       const answerIndex = Math.min(currentIndex, newAnswers.length - 1);
      //       aiMessage.content = newAnswers[answerIndex]; // Show the answer at the current index
      //       aiMessage.isLoading = false; // Clear loading state
      //     }
      //   } else {
      //     console.warn('Invalid or empty response for editUserQuestion', editedData);
      //   }
      // })
      .addCase(editUserQuestion.fulfilled, (state, action) => {
        state.editLoading = false;
        state.editResponseId = null;
       
        const { messageId, editedData, newQuestion, sessionId } = action.payload;
        const messageIndex = state.messages.findIndex(msg => msg.id === messageId);
       
        if (messageIndex !== -1 && editedData) {
          const userMessage = state.messages[messageIndex];
          const aiMessageIndex = messageIndex + 1;
          const aiMessage = aiMessageIndex < state.messages.length ? state.messages[aiMessageIndex] : null;
         
          // Initialize the arrays for pagination
          let newQuestions = [];
          let newAnswers = [];
         
          // Handle different possible response structures
          if (editedData.questionAnswer && editedData.questionAnswer.length > 0) {
            const qa = editedData.questionAnswer[0];
           
            // Create the arrays with original question first
            newQuestions = [qa.question, ...qa.newquestion || []];
            newAnswers = [qa.answer, ...qa.newanswer || []];
           
            // Important: Find the index of the edited question in the array
            // This assumes the edited question is in the newquestion array
            const editedQuestionIndex = qa.newquestion ?
              qa.newquestion.findIndex((q: string)=> q.toLowerCase() === newQuestion.toLowerCase()) + 1 : 0;
           
            // Use that index or fall back to the first new question (index 1)
            const currentIndex = editedQuestionIndex > 0 ? editedQuestionIndex : 1;
           
            // Add pagination data to user message
            userMessage.paginationData = {
              newQuestions,
              newAnswers,
              currentIndex: currentIndex, // Use the found index, not the one from the backend
              totalCount: editedData.count || newQuestions.length
            };
           
            // Update the session ID if it's not already set
            if (!userMessage.sessionId) {
              userMessage.sessionId = sessionId;
            }
           
            // Update the user message to show the edited question
            userMessage.content = newQuestions[currentIndex];
           
            // Update AI response message if it exists
            if (aiMessage && newAnswers.length > currentIndex) {
              aiMessage.content = newAnswers[currentIndex]; // Show the corresponding answer
              aiMessage.isLoading = false; // Clear loading state
            }
          } else {
            console.warn('Invalid or empty questionAnswer in response', editedData);
           
            // Fallback handling
            userMessage.content = newQuestion;
            if (aiMessage) {
              aiMessage.content = "No matching answer found for your edited question.";
              aiMessage.isLoading = false;
            }
          }
        } else {
          console.warn('Invalid or empty response for editUserQuestion', editedData);
        }
      })
 
     
      .addCase(editUserQuestion.rejected, (state, action) => {
        state.error = 'Failed to edit question';
        state.editLoading = false;
        state.editResponseId = null;
       
        // Find the response message that was being edited and reset its loading state
        if (state.editResponseId) {
          const responseIndex = state.messages.findIndex(msg => msg.id === state.editResponseId);
          if (responseIndex !== -1) {
            state.messages[responseIndex].isLoading = false;
            state.messages[responseIndex].content = "Failed to update answer. Please try again.";
          }
        }
      });
     
  },
});
 
export const { clearChat, resetMessages, addUserMessage, setPendingMessage, updateUserMessage, removeResponsesAfterEdit, navigateEditHistory, navigatePagination  } = chatSlice.actions;
export default chatSlice.reducer;