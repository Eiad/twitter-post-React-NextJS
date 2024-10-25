import React, { useState } from 'react';
import OpenAI from 'openai';
import { 
  Box, 
  TextField, 
  Button, 
  Typography,
  CircularProgress
} from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';

const TweetGeneratorComponent = ({ onTweetGenerated }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateTweet = async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that generates short, engaging tweets." },
          { role: "user", content: `Generate a tweet about ${topic}. Keep it under 280 characters.` }
        ],
      });

      const generatedTweet = completion.choices[0].message.content.trim();
      onTweetGenerated(generatedTweet);
    } catch (error) {
      console.error('Error generating tweet:', error);
      setError('Error generating tweet. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Generate a Tweet
      </Typography>
      <TextField
        fullWidth
        label="Enter a topic"
        variant="outlined"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        fullWidth
        variant="contained"
        onClick={handleGenerateTweet}
        disabled={isGenerating}
        startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
        sx={{ mb: 2 }}
      >
        {isGenerating ? 'Generating...' : 'Generate Tweet'}
      </Button>
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default TweetGeneratorComponent;


