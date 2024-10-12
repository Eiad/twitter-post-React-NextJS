import React from 'react';
import { Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PostTweetComponent from '../components/PostTweetComponent';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF9A8B', // Light pink
    },
    secondary: {
      main: '#FF6A88', // Darker pink
    },
    background: {
      default: '#FFF6F6', // Very light pink background
    },
    text: {
      primary: '#4A4A4A', // Dark gray for text
    },
  },
});

const PostTweet = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <PostTweetComponent />
      </Container>
    </ThemeProvider>
  );
};

export default PostTweet;
