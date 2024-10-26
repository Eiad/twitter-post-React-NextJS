import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Paper,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: 
    status === 'sent' ? theme.palette.success.main :
    status === 'pending' ? theme.palette.warning.main :
    theme.palette.error.main,
  color: theme.palette.common.white,
}));

const TweetStatusList = ({ tweets }) => {
  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Scheduled Tweets Status
      </Typography>
      <List>
        {tweets.map((tweet, index) => (
          <ListItem key={index} divider={index !== tweets.length - 1}>
            <ListItemText
              primary={tweet.content.substring(0, 50) + '...'}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    Scheduled: {new Date(tweet.scheduledTime).toLocaleString()}
                  </Typography>
                  <br />
                  <StatusChip
                    label={tweet.status.charAt(0).toUpperCase() + tweet.status.slice(1)}
                    size="small"
                    status={tweet.status}
                  />
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </StyledPaper>
  );
};

export default TweetStatusList;

