import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Typography,
  CircularProgress,
  Paper,
  Snackbar,
  Stack,
  TextField
} from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon, Send as SendIcon } from '@mui/icons-material';
import TweetCriteriaForm from '../TweetCriteriaForm/TweetCriteriaForm';

const TweetGeneratorComponent = ({ onSchedulerStatusChange }) => {
  const [criteria, setCriteria] = useState({
    topic: '',
    tone: 'professional',
    industry: 'technology',
    length: 200,
    numberOfTweets: 2,
    intervalDays: 0,
    intervalHours: 0,
    intervalMinutes: 10,
    intervalSeconds: 0
  });
  const [generatedTweets, setGeneratedTweets] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCriteriaChange = useCallback((newCriteria) => {
    setCriteria(newCriteria);
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const generateTweets = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:5000/generate-tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(criteria)
      });

      if (!response.ok) {
        throw new Error('Failed to generate tweets');
      }

      const data = await response.json();
      const formattedTweets = data.tweets.map(tweet => `"${tweet.content.replace(/^"|"$/g, '')}"`).join('\n\n');
      setGeneratedTweets(formattedTweets);
      setMessage('Tweets generated successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error generating tweets:', error);
      setError('Error generating tweets. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScheduleTweets = async () => {
    try {
      const tweetsArray = generatedTweets.split('\n\n').map(tweet => tweet.replace(/^"|"$/g, ''));
      if (tweetsArray.length === 0) {
        throw new Error('No tweets to schedule');
      }

      const interval = {
        days: parseInt(criteria.intervalDays) || 0,
        hours: parseInt(criteria.intervalHours) || 0,
        minutes: parseInt(criteria.intervalMinutes) || 0,
        seconds: parseInt(criteria.intervalSeconds) || 0
      };

      if (Object.values(interval).every(value => value === 0)) {
        throw new Error('Invalid interval, please set at least one non-zero value');
      }

      const response = await fetch('http://127.0.0.1:5000/schedule-tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          tweets: tweetsArray.map(content => ({ content })),
          interval
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to schedule tweets');
      }

      setMessage('Tweets scheduled successfully!');
      setOpenSnackbar(true);
      onSchedulerStatusChange(true, null);
    } catch (error) {
      console.error('Error scheduling tweets:', error);
      setError(error.message || 'Error scheduling tweets. Please try again.');
    }
  };

  const isIntervalValid = criteria.intervalDays > 0 || criteria.intervalHours > 0 || 
                        criteria.intervalMinutes > 0 || criteria.intervalSeconds > 0;

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        AI Tweet Generator and Scheduler
      </Typography>
      
      <TweetCriteriaForm onCriteriaChange={handleCriteriaChange} />
      
      <Button
        fullWidth
        variant="contained"
        onClick={generateTweets}
        disabled={isGenerating}
        startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
        sx={{ mt: 2, mb: 2 }}
      >
        {isGenerating ? 'Generating...' : 'Generate Tweets'}
      </Button>

      {generatedTweets && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Generated Tweets</Typography>
          <TextField
            fullWidth
            multiline
            minRows={5}
            maxRows={15}
            value={generatedTweets}
            onChange={(e) => setGeneratedTweets(e.target.value)}
            sx={{
              mb: 2,
              whiteSpace: 'pre-wrap',
              '& .MuiInputBase-root': {
                maxHeight: '400px',
                overflowY: 'auto',
              },
            }}
            InputProps={{
              style: { fontFamily: 'monospace' }
            }}
          />
          <Typography variant="h6" gutterBottom>Scheduling Information</Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            {['Days', 'Hours', 'Minutes', 'Seconds'].map((unit) => (
              <TextField
                key={unit}
                type="number"
                label={unit}
                value={criteria[`interval${unit}`]}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setCriteria({ ...criteria, [`interval${unit}`]: value });
                }}
                error={!isIntervalValid && criteria[`interval${unit}`] === 0}
                helperText={!isIntervalValid && criteria[`interval${unit}`] === 0 ? "At least one interval must be non-zero" : ""}
                InputProps={{ inputProps: { min: 0 } }}
              />
            ))}
          </Stack>
          <Button
            fullWidth
            variant="contained"
            onClick={handleScheduleTweets}
            startIcon={<SendIcon />}
            sx={{ mt: 2 }}
          >
            Schedule This List
          </Button>
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={message}
      />

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default TweetGeneratorComponent;
