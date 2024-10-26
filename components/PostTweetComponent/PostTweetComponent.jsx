import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Avatar, 
  Snackbar,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Twitter as TwitterIcon, Close as CloseIcon } from '@mui/icons-material';
import TweetGeneratorComponent from '../TweetGeneratorComponent/TweetGeneratorComponent';
import SchedulerControl from '../SchedulerControl/SchedulerControl';
import TweetStatusList from '../TweetStatusList/TweetStatusList';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: 1200,
  margin: 'auto',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  backgroundColor: '#FFFFFF',
}));

const PostTweetComponent = () => {
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSchedulerRunning, setIsSchedulerRunning] = useState(false);
  const [lastTweet, setLastTweet] = useState(null);
  const [scheduledTweets, setScheduledTweets] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      setIsLoggedIn(true);
      showMessage('You are now logged in. You can post a tweet.');
    } else {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setOpenSnackbar(true);
  };

  const handleLogin = () => {
    router.push('/auth');
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSchedulerStatusChange = (isRunning, lastTweetTime) => {
    setIsSchedulerRunning(isRunning);
    setLastTweet(lastTweetTime);
  };

  const handleTweetsScheduled = (tweets) => {
    setScheduledTweets(tweets.map((tweet, index) => ({
      ...tweet,
      status: 'pending',
      scheduledTime: new Date(Date.now() + index * 5000).toISOString(),
    })));
  };

  return (
    <>
      <StyledPaper elevation={3}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 70, height: 70 }}>
          <TwitterIcon fontSize="large" />
        </Avatar>
        <Typography 
          component="h1" 
          sx={{ 
            mb: 4, 
            color: 'secondary.main', 
            fontWeight: 'bold',
            fontSize: '24px' 
          }}
        >
          Schedule Your Tweets
        </Typography>
        {isLoggedIn ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <TweetGeneratorComponent 
                onSchedulerStatusChange={handleSchedulerStatusChange}
                onTweetsScheduled={handleTweetsScheduled}
                showMessage={showMessage}
              />
            </div>
            <div>
              <SchedulerControl 
                isSchedulerRunning={isSchedulerRunning}
                lastTweet={lastTweet}
                onSchedulerStatusChange={handleSchedulerStatusChange}
                showMessage={showMessage}
              />
              <TweetStatusList tweets={scheduledTweets} />
            </div>
          </div>
        ) : (
          <Button
            onClick={handleLogin}
            fullWidth
            variant="contained"
            startIcon={<TwitterIcon />}
            sx={{ 
              mt: 3, 
              mb: 2, 
              py: 2, 
              fontSize: '1.2rem',
              backgroundColor: 'secondary.main',
              '&:hover': {
                backgroundColor: 'secondary.dark',
              },
            }}
          >
            Log in
          </Button>
        )}
      </StyledPaper>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={message}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default PostTweetComponent;
