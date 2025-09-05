import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TrouverUnJob = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to improved jobs page
    navigate('/jobs', { replace: true });
  }, [navigate]);

  return null;
};

export default TrouverUnJob;