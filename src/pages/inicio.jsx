import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';

import ReactLoading from 'react-loading';

import { api } from '../services/api';
import { Header } from '../components/header';
import { Main } from '../components/main';
import { Footer } from '../components/footer';
import { Button } from '../components/button';
import { Loading } from '../components/loading';

function Inicio() {
  const { handleSignOut } = useAuth();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUsers() {
      try {
        const { data } = await api.get('/usuarios');
        setUserData(data);
        localStorage.setItem('nome', data.nome);
      } catch (error) {
        console.log(`erro: ${error}`);
        setError(error.message);
      }
      setLoading(false);
    }
    getUsers();
  }, []);

  // console.log(`loading BAIXO: ${loading}`);
  // console.log(`error: ${error}`);
  // console.log(`userData: ${JSON.stringify(userData)}`);
  // console.log(`UserID: ${user}`);

  let mainJsx = <Loading />;

  if (error) {
    mainJsx = { error };
  }

  if (!loading && !error) {
    mainJsx = (
      <div className='container'>
        <h1>Início {userData.nome}</h1>
        <Button title='Logout' onClick={handleSignOut} />
      </div>
    );
  }

  return (
    <>
      <Header />
      <Main>{mainJsx}</Main>
      <Footer />
    </>
  );
}

export default Inicio;
