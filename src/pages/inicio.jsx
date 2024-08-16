import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { CheckIcon } from '@heroicons/react/24/outline';

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
    field: 'quantidade',
    headerName: 'Qtde',
    align: 'right',
    type: 'number',
    width: 100,
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
    field: 'valor_total',
    headerName: 'Valor',
    align: 'right',
    type: 'number',
    width: 160,
    valueGetter: (value, row) => `R$ ${formatCurrency(row.valor_total * -1)}`,
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
    field: 'quantidade',
    headerName: 'Qtde',
    align: 'right',
    type: 'number',
    width: 100,
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
  const [data, setData] = useState([]);
  const [extratoFiltrado, setExtratoFiltrado] = useState([]);
  const [listaClientesVendedores, setListaClientesVendedores] = useState([]);
  const [numNotificoes, setNumNotificacoes] = useState(0);
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [totalVendas, setTotalVendas] = useState(0);
  const [dataNotificacoes, setDataNotificacoes] = useState([]);
  const isEmpreendedor = localStorage.getItem('empreendedor') === 'true';
  const userID = localStorage.getItem('id');

  function filterExtrato(id) {
    let result;
    if (!openExtratoVendedor && !openExtratoCliente) {
      if (parseInt(id) === 0) {
        result = data;
      } else {
        if (isEmpreendedor) {
          result = data.filter(user => user.compradorId == id);
        } else {
          result = data.filter(user => user.vendedorId == id);
        }
      }
      // console.log('FILTRADO: ', result);
      setExtratoFiltrado(result);
    }
  }

  function valorTotal(data) {
    let result = data.reduce(
      (partialSum, { valor_total }) => partialSum + parseFloat(valor_total),
      0
    );

    if (isEmpreendedor) {
      if (result !== 0) {
        result *= -1;
      }
    }
    return result;
  }

  //contabilizar a quandidade de notificações o usuario tem
  function countNotificacoes(data) {
    // console.log(data);
    let result;
    if (isEmpreendedor) {
      result = data.filter(pindura => pindura.aceite_empreendedor === false);
    } else {
      result = data.filter(pindura => pindura.aceite_consumidor === false);
    }

    setNumNotificacoes(result.length);
    setDataNotificacoes(result);
  }

  // Realiza o aceito do produto (aprovação rápida)
  async function handleAceita(pindura) {
    // console.log(pindura);
    try {
      const { data } = await api.put(`/pindura`, pindura).catch(function (err) {
        setError(err);
      });
      // setAprovado(false);
      getData(isEmpreendedor);
    } catch (error) {
      setError(error);
    }
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

    const result = await api.get(apiUrl).catch(function (err) {
      // console.log(err.response.status);
      setError(err);
      // alert(err.response.data.error);
    });
    if (result.data) {
      const totalVendas = result.data.filter(({ produtoId }) => produtoId >= 1);
      setData(result.data);
      getClienteFornecedor(result.data);
      countNotificacoes(result.data);
      setTotalVendas(totalVendas.length);
      setSaldoTotal(valorTotal(result.data));
    }
  }

  useEffect(() => {
    getData(isEmpreendedor);

    setLoading(false);
  }, []);

  const handleChangeVendedor = id => {
    let result;
    if (parseInt(id) === 0) {
      result = data;
    } else {
      result = data.filter(cliente => cliente.vendedorId == id);
    }

    setExtratoFiltrado(result);
  };
  const handleChangeComprador = id => {
    let result;
    if (parseInt(id) === 0) {
      result = data;
    } else {
      result = data.filter(cliente => cliente.compradorId == id);
    }
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
              Notificações ({numNotificoes})
            </button>

            <button
              className='w-32 lg:w-36 border-2 text-center p-2 cursor-pointer m-3 md:m-0'
              onClick={() => {
                handleExtratoDetalhadoVendedor(0);
              }}
            >
              Extrato Detalhado
            </button>
            <div
              className={`w-32 lg:w-36  border-2 flex flex-col justify-center items-center text-center p-2 m-3 md:m-0`}
            >
              <div className={`font-bold text-xs text-center `}>
                Total Vendas
              </div>
              <div className={`font-bold text-base text-center mx-5 pt-2`}>
                {totalVendas}
              </div>
            </div>
            <div
              className={`w-32 lg:w-36 flex flex-col justify-center items-center text-center p-2 m-3 md:m-0 ${
                saldoTotal >= 0 ? 'bg-green-200  ' : 'bg-red-200 '
              }}`}
            >
              <div
                className={`font-bold text-xs text-center ${
                  saldoTotal >= 0 ? ' text-green-900 ' : ' text-red-900'
                }`}
              >
                {saldoTotal >= 0 ? 'Saldo a receber' : 'Saldo a Pagar'}
              </div>
              <div
                className={`font-bold text-base text-center mx-5 pt-2 ${
                  saldoTotal >= 0 ? ' text-green-900 ' : ' text-red-900'
                }`}
              >
                {`R$ ${formatCurrency(saldoTotal)}`}
              </div>
            </div>
          </div>
        ) : (
          <div className='container flex justify-evenly flex-wrap my-4 '>
            <button
              className='w-32 lg:w-36 border-2 text-center p-2 cursor-pointer m-3 md:m-0'
              onClick={() => {
                handleNotificacaoCliente();
              }}
            >
              Notificações ({numNotificoes})
            </button>

            <button
              className='w-32 lg:w-36 border-2 text-center p-2 cursor-pointer m-3 md:m-0'
              onClick={() => {
                handleExtratoDetalhadoCliente(0);
              }}
            >
              Extrato Detalhado
            </button>
            <div
              className={`w-32 lg:w-36  border-2 flex flex-col justify-center items-center text-center p-2 m-3 md:m-0`}
            >
              <div className={`font-bold text-xs text-center `}>
                Total Compras
              </div>
              <div className={`font-bold text-base text-center mx-5 pt-2`}>
                {totalVendas}
              </div>
            </div>
            <div
              className={`w-32 lg:w-36 flex flex-col justify-center items-center text-center p-2 m-3 md:m-0 ${
                saldoTotal >= 0 ? 'bg-green-200  ' : 'bg-red-200 '
              }}`}
            >
              <div
                className={`font-bold text-xs text-center ${
                  saldoTotal >= 0 ? ' text-green-900 ' : ' text-red-900'
                }`}
              >
                {saldoTotal >= 0 ? 'Saldo a receber' : 'Saldo a Pagar'}
              </div>
              <div
                className={`font-bold text-base text-center mx-5 pt-2 ${
                  saldoTotal >= 0 ? ' text-green-900 ' : ' text-red-900'
                }`}
              >
                {`R$ ${formatCurrency(saldoTotal)}`}
              </div>
            </div>
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
                  <option value='0'>Todos</option>
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
                    <option value='0'>Todos</option>
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
        {(openNotificacaoCliente || openNotificacaoVendedor) &&
          dataNotificacoes.length > 0 && (
            <div className=' flex flex-col m-4'>
              <div className='text-center p-4 bg-[#918639] font-bold text-lg tracking-[4px]'>
                Aprovações
              </div>
              <div className='flex flex-col'>
                <>
                  <div className='flex flex-col'>
                    <div className={`flex bg-[#beb56c] items-center  `}>
                      <div className='flex-1 flex justify-between items-center py-2 px-2 lg:px-5   '>
                        <div className='flex-1 '>Descrição</div>
                        <div className='hidden md:flex md:flex-1 text-center'>
                          {isEmpreendedor ? 'Devedor' : 'Credor'}
                        </div>
                        <div className='w-10 text-center'>Qtde.</div>
                        <div className='w-12 text-center'>Valor</div>
                      </div>
                      <div className='w-18'>
                        <div className='h-10 w-10 px-3 m-1 '></div>
                      </div>
                    </div>
                  </div>

                  {dataNotificacoes.map((pindura, index) => {
                    let cn;
                    par(index) ? (cn = 'bg-[#beb56c]') : (cn = '');
                    return (
                      <div
                        className={`flex  ${cn} items-center  hover:font-semibold hover:text-orange-900 hover:bg-opacity-80`}
                        key={index}
                      >
                        <div className='flex-1 flex justify-between items-center py-2 px-2 lg:px-5  '>
                          <div className='flex-1 md:w-40'>
                            {pindura.produto
                              ? pindura.produto.descricao
                              : 'Crédito'}
                          </div>
                          <div className='hidden md:flex md:flex-1 text-center'>
                            {pindura.vendedor
                              ? pindura.vendedor.nome
                              : pindura.comprador.nome}
                          </div>
                          <div className='w-8 text-center'>
                            {pindura.quantidade}
                          </div>
                          <div className='w-12 text-center'>
                            {pindura.valor_total}
                          </div>
                        </div>
                        <div className='w-18'>
                          <div
                            className='h-10 w-10 px-3 m-1 cursor-pointer flex justify-center items-center text-white font-semibold bg-orange-700 rounded-full hover:font-semibold hover:text-black hover:bg-orange-300'
                            onClick={() => {
                              let data;
                              if (isEmpreendedor) {
                                data = {
                                  id: pindura.id,
                                  aceite_empreendedor: 1,
                                };
                              } else {
                                data = {
                                  id: pindura.id,
                                  aceite_consumidor: 1,
                                };
                              }
                              handleAceita(data);
                            }}
                          >
                            <CheckIcon className=' flex justify-center items-center text-lg' />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              </div>
            </div>
            // )}
          )}
        {/* FIM NOTIFICAÇÕES CLIENTE */}
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
