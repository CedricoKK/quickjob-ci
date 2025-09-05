import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Connexion = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to auth page with login mode
    navigate('/auth?mode=login', { replace: true });
  }, [navigate]);

  return null;
};

export default Connexion;