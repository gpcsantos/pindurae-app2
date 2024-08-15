import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import { api } from '../services/api';
import { Header } from '../components/header';
import { Main } from '../components/main';
import { Footer } from '../components/footer';
import { Error } from '../components/error';
import { Button } from '../components/button';
import { Loading } from '../components/loading';
import { par, formatCurrency, formatDate } from '../utils/utils';

const columnsVendedor = [
  {
    field: 'produto',
    headerName: 'Produto',

    valueGetter: (value, row) =>
      `${row.produto ? row.produto.descricao : 'Crédito'}`,
    width: 160,
  },
  {
    field: 'aceite_consumidor',
    headerName: 'Aceite Consumidor',
    align: 'center',
    renderCell: params =>
      params.row.aceite_consumidor ? (
        <CheckCircleRoundedIcon className='text-green-700 text-center' />
      ) : (
        <CancelRoundedIcon className='text-red-700 flex justify-center' />
      ),
    width: 180,
  },
  {
    field: 'createdAt',
    headerName: 'Data',
    headerAlign: 'center',
    width: 160,
    valueGetter: (value, row) => `${formatDate(row.createdAt)}`,
  },
  {
    field: 'quantidade',
    headerName: 'Qtde',
    align: 'right',
    type: 'number',
    width: 100,
  },
  {
    field: 'valor_total',
    headerName: 'Valor',
    align: 'right',
    type: 'number',
    width: 160,
    valueGetter: (value, row) => `R$ ${formatCurrency(row.valor_total)}`,
  },
  {
    field: 'observacao',
    headerName: 'Observacao',
    width: 300,
  },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  // },
];

const columnsConsumidor = [
  {
    field: 'produto',
    headerName: 'Produto',
    valueGetter: (value, row) =>
      `${row.produto ? row.produto.descricao : 'Crédito'}`,
    width: 160,
  },
  {
    field: 'aceite_empreendedor',
    headerName: 'Aceite Vendedor',
    align: 'center',
    renderCell: params =>
      params.row.aceite_empreendedor ? (
        <CheckCircleRoundedIcon className='text-green-700 text-center' />
      ) : (
        <CancelRoundedIcon className='text-red-700 flex justify-center' />
      ),
    width: 180,
  },
  {
    field: 'createdAt',
    headerName: 'Data',
    headerAlign: 'center',
    width: 160,
    valueGetter: (value, row) => `${formatDate(row.createdAt)}`,
  },
  {
    field: 'quantidade',
    headerName: 'Qtde',
    align: 'right',
    type: 'number',
    width: 100,
  },
  {
    field: 'valor_total',
    headerName: 'Valor',
    align: 'right',
    type: 'number',
    width: 160,
    valueGetter: (value, row) => `R$ ${formatCurrency(row.valor_total)}`,
  },
  {
    field: 'observacao',
    headerName: 'Observacao',
    width: 300,
  },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  // },
];

function Inicio() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [openExtratoCliente, setOpenExtratoCliente] = useState(false);
  const [openExtratoVendedor, setOpenExtratoVendedor] = useState(false);
  const [openNotificacaoCliente, setOpenNotificacaoCliente] = useState(false);
  const [openNotificacaoVendedor, setOpenNotificacaoVendedor] = useState(false);
  const [openListaVendedores, setOpenListaVendedores] = useState(false);
  const [openListaClientes, setOpenListaClientes] = useState(false);
  const [data, setData] = useState([]);
  const [extratoFiltrado, setExtratoFiltrado] = useState([]);
  const [listaClientesVendedores, setListaClientesVendedores] = useState([]);
  const [notificoes, setNotificacoes] = useState([]);
  const isEmpreendedor = localStorage.getItem('empreendedor') === 'true';
  const userID = localStorage.getItem('id');

  function filterExtrato(id) {
    let result;
    if (!openExtratoVendedor && !openExtratoCliente) {
      if (isEmpreendedor) {
        result = data.filter(user => user.compradorId == id);
      } else {
        result = data.filter(user => user.vendedorId == id);
      }
      console.log('FILTRADO: ', result);
      setExtratoFiltrado(result);
    }
  }

  function valorTotal(data) {
    return data.reduce(
      (partialSum, { valor_total }) => partialSum + parseFloat(valor_total),
      0
    );
  }

  // busca lista de fornecedores
  async function getClienteFornecedor(data) {
    try {
      const arr = [];
      data.map(obj => {
        let index = -1;
        if (isEmpreendedor) {
          // lista de compradores (clientes) para o empreendedor (vendedor)
          for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i].id === obj.compradorId) {
              index = i;
              break;
            }
          }
          if (index === -1) {
            arr.push(obj.comprador);
          }
        } else {
          // lista de empreendedores (vendedores) para o comprador (cliente)
          for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i].id === obj.vendedorId) {
              index = i;
              break;
            }
          }
          if (index === -1) {
            arr.push(obj.vendedor);
          }
        }
      });

      // console.log('ClientesVendedores: ', arr);
      setListaClientesVendedores(arr);
    } catch (error) {
      // console.log(error);
      setError(error);
    }
  }

  async function getData(isEmpreendedor) {
    let apiUrl;
    if (isEmpreendedor) {
      apiUrl = `/pindura/supplier/${userID}`;
    } else {
      apiUrl = `/pindura/consumer/${userID}`;
    }

    // console.log(apiUrl);
    const result = await api.get(apiUrl).catch(function (err) {
      // console.log(err.response.status);
      setError(err);
      // alert(err.response.data.error);
    });
    if (result.data) {
      setData(result.data);
      getClienteFornecedor(result.data);
    }
  }

  useEffect(() => {
    getData(isEmpreendedor);

    setLoading(false);
  }, []);

  const handleChangeVendedor = id => {
    const result = data.filter(cliente => cliente.vendedorId == id);
    setExtratoFiltrado(result);
  };
  const handleChangeComprador = id => {
    const result = data.filter(cliente => cliente.compradorId == id);
    setExtratoFiltrado(result);
  };

  function handleExtratoDetalhadoCliente(id) {
    setOpenExtratoCliente(!openExtratoCliente);
    filterExtrato(id);
  }
  function handleExtratoDetalhadoVendedor(id) {
    setOpenExtratoVendedor(!openExtratoVendedor);
    filterExtrato(id);
  }
  function handleNotificacaoCliente() {
    setOpenNotificacaoCliente(!openNotificacaoCliente);
  }
  function handleNotificacaoVendedor() {
    setOpenNotificacaoVendedor(!openNotificacaoVendedor);
  }
  function handleListaClientes() {
    setOpenListaClientes(!openListaClientes);
  }
  function handleListaVendedores() {
    setOpenListaVendedores(!openListaVendedores);
  }

  // console.log(`loading BAIXO: ${loading}`);
  // console.log(`error: ${error}`);
  // console.log(`userData: ${JSON.stringify(userData)}`);
  // console.log(`UserID: ${user}`);

  let mainJsx = <Loading />;

  if (error) {
    mainJsx = <Error>{error}</Error>;
  }

  if (!loading && !error) {
    mainJsx = (
      <div className='container flex flex-col'>
        <div className='container flex justify-center flex-wrap my-4 '>
          <h1>Usuário: {localStorage.getItem('nome')}</h1>
        </div>
        {isEmpreendedor ? (
          <div className='container flex justify-evenly flex-wrap my-4 '>
            <button
              className='w-32 lg:w-36 border-2 text-center p-2 cursor-pointer m-3 md:m-0'
              onClick={() => {
                handleNotificacaoVendedor();
              }}
            >
              Notificações
            </button>
            <button
              className='w-32 lg:w-36 border-2 text-center p-2 cursor-pointer m-3 md:m-0'
              onClick={() => {
                handleListaClientes();
              }}
            >
              Lista de Clientes
            </button>
            <button
              className='w-32 lg:w-36 border-2 text-center p-2 cursor-pointer m-3 md:m-0'
              onClick={() => {
                handleExtratoDetalhadoVendedor(data[0].compradorId);
              }}
            >
              Extrato Detalhado
            </button>
            <button className='w-32 lg:w-36  border-2 text-center p-2 cursor-pointer m-3 md:m-0'>
              XXXXXXXX
            </button>
          </div>
        ) : (
          <div className='container flex justify-evenly flex-wrap my-4 '>
            <button
              className='w-32 lg:w-36 border-2 text-center p-2 cursor-pointer m-3 md:m-0'
              onClick={() => {
                handleNotificacaoCliente();
              }}
            >
              Notificações
            </button>
            <button
              className='w-32 lg:w-36 border-2 text-center p-2 cursor-pointer m-3 md:m-0'
              onClick={() => {
                handleListaVendedores();
              }}
            >
              Lista de Vendedores
            </button>
            <button
              className='w-32 lg:w-36 border-2 text-center p-2 cursor-pointer m-3 md:m-0'
              onClick={() => {
                handleExtratoDetalhadoCliente(data[0].vendedorId);
              }}
            >
              Extrato Detalhado
            </button>
            <button className='w-32 lg:w-36  border-2 text-center p-2 cursor-pointer m-3 md:m-0'>
              XXXXXXXX
            </button>
          </div>
        )}

        {/* LISTA EXTRATO DETALHADO CLIENTE */}
        {openExtratoCliente && (
          <div className=' flex flex-col m-4'>
            <div className=' flex m-4'>
              <div className='flex-1 flex flex-col justify-center'>
                {' '}
                <label
                  htmlFor='select'
                  className='px-1 font-bold text-xs cursor-pointer'
                >
                  Escolha um vendedor
                </label>
                <select
                  id='select'
                  className='w-full border-2 py-1 px-4 rounded-lg '
                  onChange={event => handleChangeVendedor(event.target.value)}
                >
                  {listaClientesVendedores.map((vendedor, index) => {
                    return (
                      <option value={vendedor.id} key={index}>
                        {vendedor.nome}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className='flex-1 flex flex-col justify-center'>
                <div className='font-bold text-xs text-center'>Saldo</div>

                <div
                  className={`font-bold text-xl text-center mx-5 p-1 ${
                    valorTotal(extratoFiltrado) >= 0
                      ? 'bg-green-200 text-green-900 '
                      : 'bg-red-200 text-red-900'
                  }`}
                >
                  {`R$ ${formatCurrency(valorTotal(extratoFiltrado))}`}
                </div>
              </div>
            </div>

            <DataGrid
              rows={extratoFiltrado}
              columns={columnsConsumidor}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 20, 30]}
            />
          </div>
        )}
        {/* FIM EXTRATO DETALHADO CLIENTE */}
        {/* LISTA EXTRATO DETALHADO VENDEDOR */}
        {openExtratoVendedor && (
          <>
            <div className=' flex flex-col m-4 w-auto'>
              <div className=' flex m-4'>
                <div className='flex-1 flex flex-col justify-center'>
                  {' '}
                  <label
                    htmlFor='select'
                    className='px-1 font-bold text-xs cursor-pointer'
                  >
                    Escolha um Cliente
                  </label>
                  <select
                    id='select'
                    className='w-full border-2 py-1 px-4 rounded-lg '
                    onChange={event =>
                      handleChangeComprador(event.target.value)
                    }
                  >
                    {listaClientesVendedores.map((vendedor, index) => {
                      return (
                        <option value={vendedor.id} key={index}>
                          {vendedor.nome}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className='flex-1 flex flex-col justify-center'>
                  <div className='font-bold text-xs text-center'>Saldo</div>

                  <div
                    className={`font-bold text-xl text-center mx-5 p-1 ${
                      valorTotal(extratoFiltrado) >= 0
                        ? 'bg-green-200 text-green-900 '
                        : 'bg-red-200 text-red-900'
                    }`}
                  >
                    {`R$ ${formatCurrency(valorTotal(extratoFiltrado))}`}
                  </div>
                </div>
              </div>
              <DataGrid
                rows={extratoFiltrado}
                columns={columnsVendedor}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[10, 20, 30]}
              />
            </div>
          </>
        )}
        {/* FIM EXTRATO DETALHADO VENDEDOR */}

        {/* LISTA NOTIFICAÇÕES CLIENTE*/}
        {openNotificacaoCliente && (
          <div className='container flex justify-evenly flex-wrap my-4 '>
            Notificacao Cliente
          </div>
        )}
        {/* FIM NOTIFICAÇÕES CLIENTE */}
        {/* LISTA NOTIFICAÇÕES VENDEDOR */}
        {openNotificacaoVendedor && (
          <div className='container flex justify-evenly flex-wrap my-4 '>
            Notificacao Vendedor
          </div>
        )}
        {/* FIM NOTIFICAÇÕES VENDEDOR */}
        {/* LISTA DE CLIENTES */}
        {openListaClientes && (
          <div className='container flex justify-evenly flex-wrap my-4 '>
            Lista Clientes
          </div>
        )}
        {/* FIMDE CLIENTES */}
        {/* LISTA DE CLIENTES */}
        {openListaVendedores && (
          <div className='container flex justify-evenly flex-wrap my-4 '>
            Lista Vendedores
          </div>
        )}
        {/* FIMDE CLIENTES */}
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
