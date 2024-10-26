import React from 'react';
import { Container } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ManualTweetComponent from '../components/ManualTweetComponent/ManualTweetComponent';
import theme from '../styles/theme';

const ManualPost = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <ManualTweetComponent />
      </Container>
    </ThemeProvider>
  );
};

export default ManualPost;