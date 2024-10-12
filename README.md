
# Twitter OAuth App

This app uses Flask (backend) and Next.js (frontend) to authenticate via Twitter OAuth 2.0 and post tweets.

## Setup

1. Clone the repo.
2. Add Twitter API credentials to `.env` in `twitter-backend/`:
   ```
   TWITTER_CLIENT_ID=your-client-id
   TWITTER_CLIENT_SECRET=your-client-secret
   TWITTER_CALLBACK_URL=http://127.0.0.1:5000/callback
   ```
3. Run the backend:
   ```
   python app.py
   ```
4. Run the frontend:
   ```
   npm run dev
   ```

Now you can log in and post tweets at `http://localhost:3000`.
