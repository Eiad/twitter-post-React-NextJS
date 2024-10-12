import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/post-tweet');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Tweet Poster</h1>
      <p>Click the button below to post a new tweet!</p>
      <button 
        onClick={handleRedirect} 
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
      >
        Post a Tweet
      </button>
    </div>
  );
};

export default Home;
