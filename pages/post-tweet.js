import React from 'react';
import { Container } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import PostTweetComponent from '../components/PostTweetComponent/PostTweetComponent';
import theme from '../styles/theme';

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
