import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const SchedulerControl = ({ isSchedulerRunning, lastTweet, onSchedulerStatusChange = () => {}, showMessage }) => {
  const [message, setMessage] = useState('');
  const [remainingTweets, setRemainingTweets] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
    } catch (error) {
      console.error('Error checking scheduler status:', error);
    }
  };

  useEffect(() => {
    checkSchedulerStatus();
    const interval = setInterval(checkSchedulerStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartScheduler = async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        showMessage('Please log in first');
        return;
      }

      await api.post('/scheduler/start', {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      onSchedulerStatusChange(true, null);
      showMessage('Scheduler started successfully');
    } catch (error) {
      console.error('Error starting scheduler:', error);
      showMessage('Failed to start scheduler');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopScheduler = async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        showMessage('Please log in first');
        return;
      }

      await api.post('/scheduler/stop', {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      onSchedulerStatusChange(false, null);
      showMessage('Scheduler stopped successfully');
    } catch (error) {
      console.error('Error stopping scheduler:', error);
      showMessage('Failed to stop scheduler');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="scheduler-control">
      <h2>Automated Tweet Scheduler</h2>
      <div className={`status ${isSchedulerRunning ? 'running' : 'stopped'}`}>
        <span className="circle"></span>
        <span>{isSchedulerRunning ? 'Scheduler is running' : 'Scheduler is stopped'}</span>
      </div>
      {lastTweet && (
        <p>Last tweet: {new Date(lastTweet).toLocaleString()}</p>
      )}
      <p>Remaining tweets: {remainingTweets}</p>
      <div className="actions">
        <button
          onClick={handleStartScheduler}
          disabled={isSchedulerRunning || remainingTweets === 0 || isLoading}
        >
          {isLoading ? 'Starting...' : 'Start Scheduler'}
        </button>
        <button
          onClick={handleStopScheduler}
          disabled={!isSchedulerRunning || isLoading}
        >
          {isLoading ? 'Stopping...' : 'Stop Scheduler'}
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SchedulerControl;
