import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Inscription = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to auth page with signup mode
    navigate('/auth?mode=signup', { replace: true });
  }, [navigate]);

  return null;
};

export default Inscription;