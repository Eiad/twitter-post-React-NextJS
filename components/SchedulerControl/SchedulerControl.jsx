import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Snackbar } from '@mui/material';
import { Circle as CircleIcon } from '@mui/icons-material';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const SchedulerControl = ({ isSchedulerRunning, lastTweet, onSchedulerStatusChange = () => {} }) => {
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [remainingTweets, setRemainingTweets] = useState(0);

  const checkSchedulerStatus = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return;

      const response = await api.get('/scheduler/status', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      const { isRunning, lastTweet, remainingTweets } = response.data;
      onSchedulerStatusChange(isRunning, lastTweet);
      setRemainingTweets(remainingTweets);

      if (!isRunning || remainingTweets === 0) {
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        if (isRunning && remainingTweets === 0) {
          await handleStopScheduler();
        }
      }
    } catch (error) {
      console.error('Error checking scheduler status:', error);
    }
  };

  useEffect(() => {
    checkSchedulerStatus();
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, []);

  useEffect(() => {
    if (isSchedulerRunning && remainingTweets > 0 && !pollingInterval) {
      const interval = setInterval(checkSchedulerStatus, 10000);
      setPollingInterval(interval);
    } else if ((!isSchedulerRunning || remainingTweets === 0) && pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [isSchedulerRunning, remainingTweets]);

  const handleStartScheduler = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setMessage('Please log in first');
        setOpenSnackbar(true);
        return;
      }

      await api.post('/scheduler/start', {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setIsRunning(true);
      setMessage('Scheduler started successfully');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error starting scheduler:', error);
      setMessage('Failed to start scheduler');
      setOpenSnackbar(true);
    }
  };

  const handleStopScheduler = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setMessage('Please log in first');
        setOpenSnackbar(true);
        return;
      }

      await api.post('/scheduler/stop', {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setIsRunning(false);
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
      setMessage('Scheduler stopped successfully');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error stopping scheduler:', error);
      setMessage('Failed to stop scheduler');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Automated Tweet Scheduler
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: isSchedulerRunning && remainingTweets > 0 ? 'success.main' : 'text.secondary'
        }}>
          <CircleIcon sx={{ fontSize: 12 }} />
          <Typography>
            {isSchedulerRunning && remainingTweets > 0 ? 'Scheduler is running' : 'Scheduler is stopped'}
          </Typography>
        </Box>
        {lastTweet && (
          <Typography variant="caption" color="text.secondary">
            Last tweet: {new Date(lastTweet).toLocaleString()}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          Remaining tweets: {remainingTweets}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartScheduler}
            disabled={isSchedulerRunning || remainingTweets === 0}
          >
            Start Scheduler
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleStopScheduler}
            disabled={!isSchedulerRunning}
          >
            Stop Scheduler
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={message}
      />
    </Box>
  );
};

export default SchedulerControl;
