import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const ManualTweetComponent = ({ showMessage }) => {
  const [tweet, setTweet] = useState('');

  const handlePostTweet = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      showMessage('You must log in first.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/tweet', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tweet }),
      });

      if (!response.ok) {
        throw new Error('Failed to post tweet');
      }

      showMessage('Tweet posted successfully!');
      setTweet('');
    } catch (error) {
      console.error('Error posting tweet:', error);
      showMessage('Error posting tweet.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Manual Tweet Posting
      </Typography>
      <Box component="form" onSubmit={handlePostTweet} noValidate>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="What's happening?"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          endIcon={<SendIcon />}
          sx={{ mt: 2, mb: 2 }}
        >
          Post Tweet
        </Button>
      </Box>
    </Paper>
  );
};

export default ManualTweetComponent;
