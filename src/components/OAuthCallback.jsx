import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const provider = searchParams.get('provider');
    const error = searchParams.get('error');

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`);
    } else if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('authMethod', provider);
      navigate('/HomeScreen');
    } else {
      navigate('/login?error=Authentication failed');
    }
  }, [searchParams, navigate]);

  return <div>Processing authentication...</div>;
};

export default OAuthCallback;
