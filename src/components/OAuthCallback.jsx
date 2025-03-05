import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const provider = searchParams.get('provider');

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('authMethod', provider);
      navigate('/HomeScreen'); // or wherever you want to redirect after successful login
    } else {
      navigate('/login'); // redirect to login if no token
    }
  }, [searchParams, navigate]);

  return <div>Processing authentication...</div>;
};

export default OAuthCallback;