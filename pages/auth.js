import { useEffect } from 'react';

const Auth = () => {
  useEffect(() => {
    // Redirect to Flask backend /auth route to start Twitter OAuth flow
    window.location.href = `${process.env.NEXT_PUBLIC_FLASK_BACKEND_URL}/auth`;
  }, []);

  return (
    <div>
      <h1>Redirecting to Twitter for Authentication...</h1>
    </div>
  );
};

export default Auth;
