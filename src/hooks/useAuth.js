import { useContext } from 'react';
import { AuthContext } from '../context/auth';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    alert('Não existe um contexto de autenticação. Realize nova autenticação!');
    navigate('/login');
  }
  return context;
};
