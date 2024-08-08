import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  // const [userName, setUserName] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      api.defaults.headers.common['x-access-token'] = JSON.parse(token);
      setAuthenticated(true);
      (async function () {
        const result = await api.get('/authtoken').catch(e => {
          if (e.response.status === 500) {
            alert(`${e.response.data.msg}: Realize novo login!`);
          }
          console.log(e);
          handleSignOut();
          // setLoading(true);
          navigate('/login');
        });

        if (result) {
          localStorage.setItem('empreendedor', result.data.empreendedor);
        }
      })();
    }
    setLoading(false);
  }, []);

  const handleLogin = async loginData => {
    try {
      const {
        data: { token },
      } = await api.post('/login', {
        email: loginData.email,
        senha: loginData.password,
      });
      // console.log(token);
      if (token) {
        setAuthenticated(true);
        const decoded = jwtDecode(token);
        setUser(decoded.id);
        localStorage.setItem('id', decoded.id);
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('empreendedor', decoded.empreendedor === 1);

        api.defaults.headers.common['x-access-token'] = token;

        navigate('/inicio');
      } else {
        alert('E-mail ou senha inválidos');
      }
    } catch (error) {
      alert('E-mail ou senha inválidos!');
    }
  };
  const handleSignOut = () => {
    console.log('handleSignOut: PASSOU');
    localStorage.removeItem('token');
    localStorage.removeItem('empreendedor');
    localStorage.removeItem('id');
    api.defaults.headers.common['x-access-token'] = undefined;
    setUser(undefined);
    // setAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated,
        loading,
        setLoading,
        handleLogin,
        handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
