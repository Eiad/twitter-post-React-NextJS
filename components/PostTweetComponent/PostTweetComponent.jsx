import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Avatar, 
  Snackbar,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Twitter as TwitterIcon, Send as SendIcon, Close as CloseIcon } from '@mui/icons-material';
import TweetGeneratorComponent from '../TweetGeneratorComponent/TweetGeneratorComponent';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: 800,
  margin: 'auto',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  backgroundColor: '#FFFFFF',
}));

const PostTweetComponent = () => {
  const [tweet, setTweet] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      setIsLoggedIn(true);
      setMessage('You are now logged in. You can post a tweet.');
      setOpenSnackbar(true);
    } else {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const handlePostTweet = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      setMessage('You must log in first.');
      setOpenSnackbar(true);
      return;
    }

    try {
      await axios.post('http://127.0.0.1:5000/tweet', {
        tweet,
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      setMessage('Tweet posted successfully!');
      setOpenSnackbar(true);
      setTweet('');
    } catch (error) {
      console.error('Error posting tweet:', error);
      setMessage('Error posting tweet.');
      setOpenSnackbar(true);
    }
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

  const handleTweetGenerated = (generatedTweet) => {
    setTweet(generatedTweet);
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
          Tweet Your Thoughts
        </Typography>
        {isLoggedIn ? (
          <Box component="form" onSubmit={handlePostTweet} noValidate sx={{ mt: 1, width: '100%' }}>
            <TweetGeneratorComponent onTweetGenerated={handleTweetGenerated} />
            <TextField
              fullWidth
              multiline
              rows={5}
              variant="outlined"
              placeholder="What's happening?"
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'primary.light',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'secondary.main',
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              endIcon={<SendIcon />}
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 2, 
                fontSize: '14px',
                backgroundColor: 'secondary.main',
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                },
              }}
            >
              Post Tweet
            </Button>
          </Box>
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
            Log in with Twitter
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
