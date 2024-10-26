import React, { useState, useCallback } from 'react';
import TweetCriteriaForm from '../TweetCriteriaForm/TweetCriteriaForm';
import styles from './TweetGeneratorComponent.module.scss';

const TweetGeneratorComponent = ({ onSchedulerStatusChange, onTweetsScheduled, showMessage }) => {
  const [criteria, setCriteria] = useState({
    topic: '',
    tone: 'professional',
    industry: 'technology',
    length: 200,
    numberOfTweets: 2,
    intervalDays: '0',
    intervalHours: '0',
    intervalMinutes: '10',
    intervalSeconds: '0'
  });
  const [generatedTweets, setGeneratedTweets] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleCriteriaChange = useCallback((newCriteria) => {
    setCriteria(prevCriteria => ({
      ...prevCriteria,
      ...newCriteria
    }));
  }, []);

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
      showMessage('Tweets generated successfully!');
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

      showMessage('Tweets scheduled successfully!');
      onSchedulerStatusChange(true, null);
      onTweetsScheduled(tweetsArray.map(content => ({ content })));
    } catch (error) {
      console.error('Error scheduling tweets:', error);
      setError(error.message || 'Error scheduling tweets. Please try again.');
    }
  };

  return (
    <div className={styles.tweetGenerator}>
      <h2>AI Tweet Generator and Scheduler</h2>
      <TweetCriteriaForm onCriteriaChange={handleCriteriaChange} />
      <button onClick={generateTweets} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate Tweets'}
      </button>
      {generatedTweets && (
        <div className={styles.generatedTweets}>
          <h3>Generated Tweets</h3>
          <textarea
            value={generatedTweets}
            onChange={(e) => setGeneratedTweets(e.target.value)}
            rows={10}
          />
          <div className={styles.schedulingInfo}>
            <h3>Scheduling Information</h3>
            <div className={styles.intervalInputs}>
              {['Days', 'Hours', 'Minutes', 'Seconds'].map((unit) => (
                <div key={unit} className={styles.intervalInput}>
                  <label>{unit}</label>
                  <input
                    type="number"
                    value={criteria[`interval${unit}`]}
                    onChange={(e) => handleCriteriaChange({ [`interval${unit}`]: e.target.value })}
                    min="0"
                  />
                </div>
              ))}
            </div>
            <button onClick={handleScheduleTweets}>Schedule This List</button>
          </div>
        </div>
      )}
      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
      {message && <p className={`${styles.message} ${styles.success}`}>{message}</p>}
    </div>
  );
};

export default TweetGeneratorComponent;
