import React from 'react';
import { Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PostTweetComponent from '../components/PostTweetComponent/PostTweetComponent';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF9A8B', 
    },
    secondary: {
      main: '#FF6A88', 
    },
    background: {
      default: '#FFF6F6', 
    },
    text: {
      primary: '#4A4A4A',
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
