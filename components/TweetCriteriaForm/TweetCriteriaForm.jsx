import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Typography,
  Stack
} from '@mui/material';

const TweetCriteriaForm = ({ onCriteriaChange }) => {
  const [criteria, setCriteria] = useState({
    topic: '',
    tone: 'professional',
    industry: 'technology',
    length: 200,
    numberOfTweets: 5
  });

  const handleChange = useCallback((field) => (event) => {
    const value = event.target.value;
    const newCriteria = { ...criteria, [field]: value };
    setCriteria(newCriteria);
    onCriteriaChange(newCriteria);
  }, [criteria, onCriteriaChange]);

  return (
    <Box sx={{ mb: 4 }}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Topic"
          value={criteria.topic}
          onChange={handleChange('topic')}
          helperText="Main subject of the tweets"
        />

        <FormControl fullWidth>
          <InputLabel>Tone</InputLabel>
          <Select
            value={criteria.tone}
            onChange={handleChange('tone')}
            label="Tone"
          >
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="humorous">Humorous</MenuItem>
            <MenuItem value="informative">Informative</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Industry</InputLabel>
          <Select
            value={criteria.industry}
            onChange={handleChange('industry')}
            label="Industry"
          >
            <MenuItem value="technology">Technology</MenuItem>
            <MenuItem value="marketing">Marketing</MenuItem>
            <MenuItem value="finance">Finance</MenuItem>
            <MenuItem value="healthcare">Healthcare</MenuItem>
            <MenuItem value="education">Education</MenuItem>
          </Select>
        </FormControl>

        <Box>
          <Typography gutterBottom>Tweet Length</Typography>
          <Slider
            value={criteria.length}
            onChange={(_, value) => handleChange('length')({ target: { value } })}
            min={50}
            max={280}
            valueLabelDisplay="auto"
          />
        </Box>

        <TextField
          fullWidth
          type="number"
          label="Number of Tweets"
          value={criteria.numberOfTweets}
          onChange={handleChange('numberOfTweets')}
          inputProps={{ min: 1, max: 20 }}
        />
      </Stack>
    </Box>
  );
};

export default React.memo(TweetCriteriaForm);
