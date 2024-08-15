import { createContext, useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { api } from '../services/api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  // const [userName, setUserName] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function validaToken(token) {
    try {
      const result = await api.get('/authtoken');

      if (result.data) {
        localStorage.setItem('empreendedor', result.data.empreendedor);
      }

      return result;
    } catch (err) {
      return err;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    (async function () {
      try {
        if (token) {
          setAuthenticated(true);
          api.defaults.headers.common['x-access-token'] = JSON.parse(token);
          const result = await validaToken(token);

          if (result.status !== 200) {
            throw result.response.data.msg;
          }
          const decoded = jwtDecode(token);
          if (parseInt(decoded.id) !== parseInt(localStorage.getItem('id'))) {
            throw `ERRO: Local Storage foi alterado indevidamente. Realize novo login!`;
          }
        }
      } catch (error) {
        setAuthenticated(false);
        console.log(error);
        handleSignOut();
        alert(error);
      }
    })();

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

        const { data } = await api.get(`/usuarios/${decoded.id}`);
        localStorage.setItem('nome', data.nome);

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
    if (
      localStorage.getItem('token') &&
      localStorage.getItem('empreendedor') &&
      localStorage.getItem('id') &&
      localStorage.getItem('nome')
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('empreendedor');
      localStorage.removeItem('id');
      localStorage.removeItem('nome');
      // api.defaults.headers.common['x-access-token'] = undefined;
      setUser(undefined);
    }
    setAuthenticated(false);
    <Navigate to='/login' replace={true} />;
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
