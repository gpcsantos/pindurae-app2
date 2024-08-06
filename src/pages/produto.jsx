import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { TrashIcon } from '@heroicons/react/24/outline';

import { Header } from '../components/header';
import { Main } from '../components/main';
import { Footer } from '../components/footer';
import { Loading } from '../components/loading';
import { Error } from '../components/error';
import { Dialogo } from '../components/dialogo';
import { par } from '../utils/utils';

function Produto() {
  const userID = localStorage.getItem('id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataProducts, setDataProducts] = useState(true);
  const [updateProduct, setUpdateProduct] = useState({});
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleOnClose = () => setOpen(false);

  async function getProductsByUser() {
    try {
      const { data } = await api
        .get(`/produtos/usuario/${userID}`)
        .catch(function (err) {
          // console.log(err);
          // alert(err.response.data.error);
        });

      data.sort((a, b) => {
        if (a.descricao.toLowerCase() < b.descricao.toLowerCase()) return -1;
        if (a.descricao.toLowerCase() > b.descricao.toLowerCase()) return 1;
        return 0;
      });

      setDataProducts(data);
    } catch (error) {
      // console.log(error.message);
      setError(error.message);
    }

    setLoading(false);
  }

  useEffect(() => {
    getProductsByUser();
  }, [open]);

  function handlerProdutoNovoClick() {
    navigate('/produtos/novo');
  }
  async function handlerProdutoExcluirClick(id) {
    try {
      const { data } = await api
        .delete(`/produtos/${id}`)
        .catch(function (err) {
          console.log('ERROR Excluir: ', err);
          // alert(err);
        });

      if (data.status === false) {
        alert(data.msg);
      }
    } catch (error) {
      // console.log(error.message);
      setError(error.message);
    }

    getProductsByUser();
  }
  function handlerAlterarProduto(produto) {
    setUpdateProduct(produto);
    setOpen(true);
  }

  let mainJsx = <Loading />;

  if (error) {
    mainJsx = <Error>{error}</Error>;
  }

  if (!loading && !error) {
    mainJsx = (
      <div className='container flex flex-col'>
        <div className='container flex justify-evenly'>
          <div
            className='h-15 p-6 border-2 m-5 flex justify-center items-center cursor-pointer'
            onClick={handlerProdutoNovoClick}
          >
            Novo Produto
          </div>
          <div className='h-15 p-6 border-2 m-5 flex justify-center items-center'>
            Produtos mais vendidos
          </div>
        </div>
        <div></div>
        <div className=' flex flex-col m-4'>
          <div className='text-center p-4 bg-[#918639] font-bold text-lg tracking-[4px]'>
            Lista de Produtos
          </div>
          <div className='flex flex-col'>
            {dataProducts.length === 0 ? (
              <div className='text-center'>
                Não há produtos a serem listados
              </div>
            ) : (
              dataProducts.map((produto, index) => {
                let cn;
                par(index) ? (cn = 'bg-[#beb56c]') : (cn = '');
                return (
                  <div
                    className={`flex  ${cn} items-center cursor-pointer hover:font-semibold hover:text-orange-900 hover:bg-opacity-80`}
                    key={produto.id}
                  >
                    <div
                      className='flex-1 flex justify-between items-center py-2 px-5  '
                      onClick={() => {
                        produto = {
                          id: produto.id,
                          descricao: produto.descricao,
                          preco: produto.preco,
                        };
                        handlerAlterarProduto(produto);
                      }}
                    >
                      <div>{produto.descricao}</div>
                      <div>{produto.preco}</div>
                    </div>
                    <div
                      className='h-10 w-10 px-3 m-1 cursor-pointer flex justify-center items-center text-white font-semibold bg-orange-700 rounded-full hover:font-semibold hover:text-black hover:bg-orange-300'
                      onClick={() => handlerProdutoExcluirClick(produto.id)}
                    >
                      <TrashIcon className='h-6 flex justify-center items-center' />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {/* DIALOGO */}

        <Dialogo open={open} setOpen={handleOnClose} data={updateProduct} />
      </div>
    );
  }

  return (
    <>
      <Header />
      <Main containerClassName='flex justify-center'>{mainJsx}</Main>
      <Footer />
    </>
  );
}

export default Produto;
