import React, { KeyboardEvent, useState } from 'react';
import { TextField, IconButton, Box, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Button, Rating, Typography, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { RootState, useAppDispatch } from 'store';
import { useSelector } from 'react-redux';
import { closeRating, incrementClick, resetClick } from 'store/slices/clickSlice';
import CloseIcon from '@mui/icons-material/Close';

interface Window {
  webkitSpeechRecognition: any;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, disabled = false }) => {
  const [recording, setRecording] = useState(false);
  const dispatch = useAppDispatch();
  const [rating, setRating] = useState<number>(0);

  const {  showRating } = useSelector((state: RootState) => state.click);
  const count = useSelector((state: RootState) => state.history.count);
  console.log(count,"count");
  


  const handleSpeechToText = () => {
    if (!('webkitSpeechRecognition' in window)) {
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setRecording(true);
      console.log('Voice recording started...');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      console.log('Transcript:', transcript);
      onChange(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setRecording(false);
      console.log('Voice recording stopped...');
    };

    if (recording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (count >= 5) {
      console.log('Send blocked - Show rating dialog');
      return;
    }
    dispatch(incrementClick());
    onSend();
    console.log('Send Button Clicked');
  };

  const handleClose = () => {
    dispatch(closeRating());
    dispatch(resetClick());
  };

  const handleSubmitRating = () => {
    console.log('Rating submitted:', rating);
    handleClose();
  };
  

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <TextField
        fullWidth
        multiline
        maxRows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything"
        variant="outlined"
        disabled={disabled}
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '24px',
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleSpeechToText}
                color={recording ? 'error' : 'primary'}
                sx={{ ml: 1 }}
              >
  <Tooltip title={recording ? 'Recording in progress...' : 'Start Recording'} arrow placement="top">
    {recording ? <MicOffIcon /> : <MicIcon />}
  </Tooltip>              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <IconButton
        color="primary"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        sx={{ ml: 1 }}
      >
        <SendIcon />
      </IconButton>

      <Dialog open={showRating} onClose={handleClose}>
  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    Rate Us
    <IconButton onClick={handleClose} size="small">
    <CloseIcon />

    </IconButton>
  </DialogTitle>
  <DialogContent>
    <Box>
      <Typography variant="body1">
        How was your experience  with <br/> ChatBot RateUs?
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
      <Rating
        name="feedback-rating"
        value={rating}
        onChange={(event, newValue) => setRating(newValue || 0)}
        size="large"
      />
   
      <Button
        onClick={handleSubmitRating}
        color="primary"
        variant="contained"
        disabled={rating === 0}
        sx={{ marginTop: 2 }}
      >
        Submit
      </Button>
    </Box>
  </DialogContent>
</Dialog>


    </Box>
  );
};

export default ChatInput;
