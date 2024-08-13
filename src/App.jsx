import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ReactLoading from 'react-loading';
import Login from './pages/login';
import Cadastro from './pages/cadastro';
import Inicio from './pages/inicio';
import Home from './pages/home';
import Perfil from './pages/perfil';
import Produto from './pages/produto';
import ProdutoNovo from './pages/produto_novo';
import Pindura from './pages/pindura';
import Clientes from './pages/clientes';
import { Loading } from './components/loading';

import NotFound from './pages/not_found';
import { AuthContextProvider } from './context/auth';
import { useAuth } from './hooks/useAuth';

const AuthLayout = () => {
  const { authenticated, loading } = useAuth();
  // console.log(`loading AUTH: ${loading}`);
  // console.log(`authenticated: ${authenticated}`);

  if (loading) {
    return <Loading />;
  }
  if (authenticated) {
    // const isAuthenticated = Parse.User.current().getSessionToken();
    return <Outlet />; // or loading indicator, etc...
  }
  return <Navigate to={'/login'} replace />;
};

function App() {
  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/cadastro' element={<Cadastro />} />
          <Route element={<AuthLayout />}>
            <Route path='/inicio' element={<Inicio />} />
            <Route path='/perfil' element={<Perfil />} />
            <Route path='/produtos' element={<Produto />} />
            <Route path='/clientes' element={<Clientes />} />

            <Route path='/produtos/novo' element={<ProdutoNovo />} />
            <Route path='/pindura' element={<Pindura />} />
          </Route>

          <Route path='*' element={<NotFound />} />
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
