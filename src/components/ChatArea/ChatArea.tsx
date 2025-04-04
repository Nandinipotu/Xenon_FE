import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  CircularProgress,
  IconButton,
  Tooltip,
  TextField 
} from '@mui/material';
import { ThumbUp, ThumbDown, ContentCopy, Edit, VolumeUp, VolumeOff, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { chatAreaStyles } from './ChatAreaStyles';
import ChatInput from './ChatInput';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch, useAppSelector } from "../../api/hooks";
import { navigateEditHistory, sendMessage, updateUserMessage } from "../../store/slices/chatSlice";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ContentCopy as CopyIcon, Check as CheckIcon } from '@mui/icons-material';
import { ThreeDots } from 'react-loader-spinner';
import { fetchChatHistory } from 'store/slices/sessionIdSlice';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { fetchGoogleAccount } from 'store/slices/login';
import Cookies from 'js-cookie';

interface History {
  date: string;
  questionAnswer: { question: string; answer: string }[];
}

interface ChatAreaProps {
  mode: 'light' | 'dark';
  message: string;
}


const ChatArea: React.FC = () => {
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);  // ✅ Track speaking state per message
  const dispatch = useAppDispatch();
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  

  const { messages, loading } = useAppSelector((state) => state.chat);
  const activeColor = mode === 'dark' ? '#191970' : 'black';
  console.log("newchat", messages);
  // const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const selectedHistory = useAppSelector((state) => state.history.selectedHistory) as History | null;
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const conversationStarted = messages.length > 0 || selectedHistory !== null;
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

 
  // useEffect(() => {
  //   const token = Cookies.get("jwt");
  //   if (!token) {
  //     dispatch(fetchGoogleAccount());
  //   }
  // }, [dispatch]);
  

  useEffect(() => { 
    scrollToBottom();
  }, [messages, loading]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
  
    if (trimmedInput !== '') {
      try {
        const isImagePrompt = trimmedInput.toLowerCase().includes('generate');
  
        const sessionId = crypto.randomUUID();
  
        await dispatch(fetchChatHistory(sessionId));
  
        window.history.pushState({}, '', `/chatbot/c/${sessionId}`);
  
        dispatch(
          sendMessage({
            prompt: trimmedInput,
            message: isImagePrompt ? '' : trimmedInput,
            isNewChat: true,
          })
        );
  
        setInputValue('');
        // console.log('Message sent with session ID:', sessionId);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  
  useEffect(() => {
    if (selectedHistory) {
      setIsHistoryLoading(true);
      const timer = setTimeout(() => {
        setIsHistoryLoading(false);
      }, 1000); 

      return () => clearTimeout(timer);
    }
  }, [selectedHistory]);
  
  useEffect(() => {
    if (selectedHistory) {
      setIsHistoryLoading(true);
      const timer = setTimeout(() => {
        setIsHistoryLoading(false);
      }, 1000);
 
      return () => clearTimeout(timer);
    }
  }, [selectedHistory]);
 
const [likedIndexes, setLikedIndexes] = useState<string[]>([]);
const [dislikedIndexes, setDislikedIndexes] = useState<string[]>([]);

const handleLike = (id: string) => {
  setLikedIndexes((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
  );
  setDislikedIndexes((prev) => prev.filter((i) => i !== id)); // Remove from dislikes when liked
};

const handleDislike = (id: string) => {
  setDislikedIndexes((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
  );
  setLikedIndexes((prev) => prev.filter((i) => i !== id)); // Remove from likes when disliked
};

 

const handleCopy = (content: string, messageId?: string) => {
  navigator.clipboard.writeText(content);
  setCopiedMessageId(messageId || content); // Use content as fallback ID
  setTimeout(() => setCopiedMessageId(null), 1500);
};



  const handleEdit = (id: string) => {
    // Find the message to edit
    const messageToEdit = messages.find(msg => msg.id === id);
    if (messageToEdit) {
      setEditingMessageId(id);
      setEditedContent(messageToEdit.content);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedContent('');
  };
  const handleNavigateEditHistory = (id: string, index: number) => {
    dispatch(navigateEditHistory({ id, index }));
  };
  const handleSaveEdit = (id: string) => {
    dispatch(updateUserMessage({ id, content: editedContent }));
    
    dispatch(
      sendMessage({
        prompt: editedContent,
        message: editedContent, 
        isNewChat: false,
        isEdit: true,  
        editedMessageId: id 
      })
    );
    
    setEditingMessageId(null);
    setEditedContent('');
  };

  const handleSpeak = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingMessageId === id) {
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onend = () => setSpeakingMessageId(null);
        window.speechSynthesis.speak(utterance);
        setSpeakingMessageId(id);
      }
    } else {
      console.error('Text-to-speech not supported');
    }
  };

  const renderFormattedMessage = (text: string, mode: 'light' | 'dark' = 'light') => {
    if (!text) {
      return (
<Box 
                sx={{ 
                    color: mode === 'dark' ? 'black' : 'black',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                }}
            >
                Oops! Something went wrong on our end. Give it another try in a bit!
            </Box>
      );
  }
    const codeBlockRegex = /```(.*?)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
  
    text.replace(codeBlockRegex, (match, lang, code, offset) => {
      if (offset > lastIndex) {
        parts.push(
          <Typography
            key={lastIndex}
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              fontSize: '14px',     
              lineHeight: '1.6',     
              fontFamily: 'Arial, sans-serif', 
              // color: mode === 'dark' ? '#E1E1E1' : '#333',
            }}
          >
            {text.substring(lastIndex, offset)}
          </Typography>
        );
      }
  
      const handleCopyCode = async (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedMessageId(code); // Use content ascode fallback ID
        setTimeout(() => setCopiedMessageId(null), 1500);
      };
  
      parts.push(
        <Box
          key={offset}
          sx={{
            position: 'relative',
            border: '1px solid #ccc',
            borderRadius: '8px',
            marginY: 2,
            overflowX: 'auto',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: mode === 'dark' ? '#2D2D2D' : '#F5F5F5',
          }}
        >
          {/* <Tooltip title="Copy to clipboard" arrow> */}
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
                color: mode === 'dark' ? 'white' : 'black',
              }}
              onClick={() => handleCopyCode(code)}
            >
                {copiedMessageId === code ? (
 <CheckCircle className='Icon_size' />
) : (
  <ContentCopy className='Icon_size' />
)}            </IconButton>

           
          {/* </Tooltip> */}
  
          <SyntaxHighlighter
            language={lang || 'javascript'}
            style={mode === 'dark' ? oneDark : tomorrow}
            showLineNumbers
            customStyle={{
              margin: 0,
              fontSize: '12px',      
              fontFamily: 'Consolas, Monaco, "Courier New", monospace', 
              padding: '12px',     
            }}
          >
            {code.trim()}
          </SyntaxHighlighter>
        </Box>
      );
  
      lastIndex = offset + match.length;
      return match;
    });
  
    if (lastIndex < text.length) {
      parts.push(
        <Typography
          key={lastIndex}
          variant="body1"
          sx={{
            whiteSpace: 'pre-wrap',
            fontSize: '14px',      
            lineHeight: '1.6',     
            fontFamily: 'Arial, sans-serif', 
            // color: mode === 'dark' ? '#E1E1E1' : '#333', 
          }}
        >
          {text.substring(lastIndex)}
        </Typography>
      );
    }
  
    return parts;
  };
  
  
  
  

  return (
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden', 
  }}
>
  {!conversationStarted ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        How can I support you today?
      </Typography>

      <Box sx={{width: '100%',      maxWidth: { xs: '350px', sm: '400px', md: '650px' }} }     // Add some padding to prevent it from touching edges
 >
  <ChatInput
    value={inputValue}
    onChange={handleInputChange}
    onSend={handleSendMessage}
  />
</Box>


    </Box>
  ) : (
    <>
      <Box
        sx={{
          flex: 1,
          padding: 2,
          width: '60%',
          alignSelf: 'center',
          overflowX:'hidden',
          overflowY: 'auto',
        }}
      >
         {isHistoryLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
               <ThreeDots 
                          color={mode === 'dark' ? '#FFFFFF' : '#000000'} 
                          height={40} width={40} />          </Box>
        )}

        <Box
          sx={{
            opacity: isHistoryLoading ? 0.3 : 1,
            pointerEvents: isHistoryLoading ? 'none' : 'auto',
          }}
        />

        {selectedHistory && (
          <>
          
            {selectedHistory.questionAnswer.map((qa, index) => (
              <Box key={index} sx={{  mt: 2,mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                <Box
  sx={{
    backgroundColor: mode === 'dark' ? 'white' : 'black',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '12px',
    maxWidth: '60%',
    wordWrap: 'break-word',
    position: 'relative',
    marginBottom: '16px', // Space for the icons below
    '&:hover .question-icons': {
      opacity: 1,
    },
  }}
>
  <Typography sx={{ fontSize: '12px' }}>
    {qa.question}
  </Typography>

  <Box
    className="question-icons"
    sx={{
      display: 'flex',
      justifyContent: 'flex-start',
      gap: '0px',
      opacity: 0,
      transition: 'opacity 0.2s ease-in-out',
      position: 'absolute',
      bottom: '-32px', 
      left: '9px',   
      borderRadius: '8px',
      padding: '4px',
    }}
  >
 <IconButton onClick={() => handleCopy(qa.question)}>
  {copiedMessageId === qa.question ? (
    <CheckCircle className='Icon_size' />
  ) : (
    <ContentCopy className='Icon_size' />
  )}
</IconButton>
    {/* <IconButton onClick={() => handleEdit(qa.question)}>
      <Edit className='Icon_size' />
    </IconButton> */}
  </Box>
</Box>


                </Box>

                <Box
  sx={{
    justifyContent: 'flex-start',
    alignItems: 'center',
    mb: 1,
  }}
>
  {/* Content Box */}
  <Box
    sx={{
      backgroundColor: '#f1f1f1',
      color: 'black',
      padding: '8px 12px',
      borderRadius: '12px',
      maxWidth: '80%',
      wordWrap: 'break-word',
      position: 'relative',
    }}
  >
    <Typography>{renderFormattedMessage(qa.answer)}</Typography>
  </Box>

  {/* Icons Outside the Content Box */}
  <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: '8px', mt: 1, ml: 1 }}>
    <IconButton onClick={() => handleCopy(qa.answer)}>
      {copiedMessageId === qa.answer ? (
        <CheckCircle className='Icon_size' />
      ) : (
        <ContentCopy className='Icon_size' />
      )}
    </IconButton>

    <IconButton
      onClick={() => handleLike(qa.answer)}
      style={{ display: dislikedIndexes.includes(qa.answer) ? 'none' : 'inline-flex' }}
    >
      <ThumbUp
        className='Icon_size'
        sx={{ color: likedIndexes.includes(qa.answer) ? 'blue' : 'inherit' }}
      />
    </IconButton>

    {!likedIndexes.includes(qa.answer) && (
      <IconButton
        onClick={() => handleDislike(qa.answer)}
        style={{ display: likedIndexes.includes(qa.answer) ? 'none' : 'inline-flex' }}
      >
        <ThumbDown
          className='Icon_size'
          sx={{ color: dislikedIndexes.includes(qa.answer) ? 'red' : 'inherit' }}
        />
      </IconButton>
    )}

    <IconButton onClick={() => handleSpeak(index.toString(), qa.answer)}>
      {speakingMessageId?.toString() === index.toString() ? (
        <VolumeOff className='Icon_size' />
      ) : (
        <VolumeUp className='Icon_size' />
      )}
    </IconButton>
  </Box>
</Box>

              </Box>
            ))}
          </>
        )}

{messages.map((message) => (
  <Box
    key={message.id}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
      margin: '10px 0',
      maxWidth: '100%',
    }}
  >
    <Typography variant="caption" sx={{ mb: 0.5 }}>
      {message.sender === 'user' }
    </Typography>
    {message.sender === 'user' && editingMessageId === message.id ? (
      <Box sx={{ 
        width: '60%',
        backgroundColor: mode === 'dark' ? 'white' : 'black',
        borderRadius: '12px',
        padding: '8px 12px',
      }}>
        <TextField
          fullWidth
          multiline
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          sx={{ 
            '& .MuiInputBase-input': {
              color: mode === 'light' ? 'white' : 'black',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
          }}
          autoFocus
        />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          mt: 1,
          gap: '8px'
        }}>
          <Button 
            onClick={handleCancelEdit}
            variant="outlined"
            size="small"
            sx={{ 
              color: mode === 'light' ? 'white' : 'black',
              borderColor: mode === 'light' ? 'white' : 'black',
              '&:hover': {
                borderColor: mode === 'light' ? 'white' : 'black',
                opacity: 0.8,
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleSaveEdit(message.id)}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: mode === 'light' ? 'white' : 'black',
              color: mode === 'light' ? 'black' : 'white',
              '&:hover': {
                backgroundColor: mode === 'light' ? 'white' : 'black',
                opacity: 0.8,
              }
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    ) : (
    <Box
  sx={{
    backgroundColor: message.sender === 'user'
      ? (mode === 'dark' ? 'white' : 'black')
      : (mode === 'dark' ? 'white' : '#f1f1f1'),
      color: message.sender === 'user'
      ? (mode === 'light' ? 'white !important' : 'black !important')  // White text for sent messages in light mode
      : 'black !important',                                // Black text for all other messages
    padding: '8px 12px',
    borderRadius: '12px',
    width: '60%',
    position: 'relative',
  }}
    >
      {renderFormattedMessage(message.content)}

      {message.type === 'image' && message.imageUrl && (
        <Box sx={{ mt: 1, width: '70%' }}>
          <img
            src={message.imageUrl}
            alt="Generated"
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </Box>
      )}
    </Box>
    )}
   
    <Box
  sx={{
    display: 'flex',
    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
    gap: '8px',
    mt: 1,
  }}
>
<IconButton onClick={() => handleCopy(message.content, message.id)}>
  {copiedMessageId === message.id ? (
    <CheckCircle className='Icon_size' />
  ) : (
    <ContentCopy className='Icon_size' />
  )}
</IconButton>

  {message.sender === 'user' && editingMessageId !== message.id && (
        <IconButton onClick={() => handleEdit(message.id)}>
          <Edit className='Icon_size' />
        </IconButton>
      )}

  {message.sender !== 'user' && (
    <>
<IconButton 
  className='Icon_size' 
  onClick={() => handleLike(message.id)}
  style={{ display: dislikedIndexes.includes(message.id) ? 'none' : 'inline-flex' }}>
  <ThumbUp 
    className='Icon_size' 
    sx={{ color: likedIndexes.includes(message.id) ? 'blue' : 'inherit' }} 
  />
</IconButton>

{!likedIndexes.includes(message.id) && (
  <IconButton 
    className='Icon_size' 
    onClick={() => handleDislike(message.id)}
    style={{ display: likedIndexes.includes(message.id) ? 'none' : 'inline-flex' }}>
    <ThumbDown 
      className='Icon_size' 
      sx={{ color: dislikedIndexes.includes(message.id) ? 'red' : 'inherit' }} 
    />
  </IconButton>
)}

      <IconButton  onClick={() => handleSpeak(message.id, message.content)}>
        {speakingMessageId === message.id ? <VolumeOff className='Icon_size' /> : <VolumeUp className='Icon_size' />}
      </IconButton>
    </>
  )}
  {message.sender === 'user' && message.editHistory && message.editHistory.length > 0 && (
  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
    <IconButton 
      disabled={message.currentEditIndex === 0}
      onClick={() => handleNavigateEditHistory(message.id,(message.currentEditIndex ?? 0) - 1)}
    >
      <NavigateBefore />
    </IconButton>
    <Typography variant="caption">
      {`${(message.currentEditIndex ?? 0) + 1}/${message.editHistory.length + 1}`}
    </Typography>
    <IconButton 
      disabled={message.currentEditIndex === message.editHistory.length}
      onClick={() => handleNavigateEditHistory(message.id,(message.currentEditIndex ?? 0) + 1)}
    >
      <NavigateNext />
    </IconButton>
  </Box>
)}
</Box>
  </Box>
))}


        
        {loading &&                 <ThreeDots 
                          color={mode === 'dark' ? '#FFFFFF' : '#000000'} 
                          height={35} width={35} />}
                           <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ alignSelf:"center", width: { xs: '350px', sm: '400px', md: '650px' },    padding: '8px',      // Add some padding to prevent it from touching edges
 }}>
<ChatInput
        value={inputValue}
        onChange={handleInputChange}
        onSend={handleSendMessage}
        disabled={loading || isHistoryLoading}
      />
</Box>
     
    </>
  )}
</Box>

  );
};

export default ChatArea;