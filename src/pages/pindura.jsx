import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CheckIcon } from '@heroicons/react/24/outline';

import { Pindurar } from '../components/pindurar';
import { Pagamento } from '../components/pagamento';
import { ExtratoFinanceiro } from '../components/extrato';
import { Header } from '../components/header';
import { Main } from '../components/main';
import { Footer } from '../components/footer';
import { Loading } from '../components/loading';
import { Error } from '../components/error';
import { par, formatCurrency } from '../utils/utils';

function Pindura() {
  const userID = localStorage.getItem('id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aprovar, setAprovar] = useState([]);
  const [aprovado, setAprovado] = useState(false);
  const [viewExtrato, setViewExtrato] = useState(false);
  const [extrato, setExtrato] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [total, setTotal] = useState(0);

  // ********************************
  //        Modais
  // ********************************
  const [openPindurar, setOpenPindurar] = useState(false);
  const handleOnClosePindurar = () => setOpenPindurar(false);
  const [openPagamento, setOpenPagamento] = useState(false);
  const handleOnClosePagamento = () => setOpenPagamento(false);

  // abre o modal
  function handlePindurarDialogOpen() {
    setOpenPindurar(true);
  }
  function handlePagamentoDialogOpen() {
    getFornecedor();
    setOpenPagamento(true);
  }

  // ********************************
  //     FIM Modais
  // ********************************

  // função para gerar lista de itens para aprovação rápida
  async function getAprovar() {
    try {
      const result = await api
        .get(`/pindura/consumer/${userID}?aceite=false`)
        .catch(function (err) {
          setError(err);
        });
      if (result) {
        setAprovar(result.data);
      }
    } catch (error) {
      setError(error);
    }
  }
  // FIM função para aprovação rápida

  // Realiza o aceito do produto (aprovação rápida)
  async function handleAceita(pindura) {
    try {
      const { data } = await api.put(`/pindura`, pindura).catch(function (err) {
        setError(err);
      });
      setAprovado(false);
    } catch (error) {
      setError(error);
    }
  }

  // função extrato
  function handlePinduradosExtrato() {
    viewExtrato ? setViewExtrato(false) : setViewExtrato(true);
  }

  // busca os produtos pindurados do usuário logado
  async function getExtrato() {
    const result = await api
      .get(`/pindura/consumer/${userID}`)
      .catch(function (err) {
        // console.log(err.response.status);
        setError(err);
        // alert(err.response.data.error);
      });
    if (result) {
      setExtrato(result.data);
      const sum = result.data.reduce(
        (partialSum, { valor_total }) => partialSum + parseFloat(valor_total),
        0
      );
      setTotal(sum);
    }
  }

  // busca lista de fornecedores
  async function getFornecedor() {
    try {
      const pindura = await api
        .get(`/pindura/consumer/${userID}`)
        .catch(function (err) {
          // console.log(err);
          alert(err.response.data.error);
        });

      const arr = [];
      pindura.data.map(obj => {
        let index = -1;

        for (var i = 0, len = arr.length; i < len; i++) {
          if (arr[i].id === obj.vendedor.id) {
            index = i;
            break;
          }
        }
        if (index === -1) {
          arr.push(obj.vendedor);
        }
      });

      setFornecedores(arr);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  }

  //finaliza processo de pindurar
  async function onSubmitPindurar(formData) {
    // console.log(formData);
    const pagamento = {
      compradorId: userID,
      vendedorId: formData.select,
      valor_total: formData.valor,
      observacao: formData.observacao,
      aceite_consumidor: 1,
      aceite_empreendedor: 0,
    };

    // console.log(pagamento);

    const data = await api.post(`/pindura`, pagamento).catch(function (err) {
      // console.log(err);
      alert(err.response.data.error);
    });

    if (data) {
      alert('Pagamento adicionado!');
    }
  }

  useEffect(() => {
    try {
      setLoading(true);
      getAprovar();
      getExtrato();

      setAprovado(true);
      setLoading(false);
    } catch (error) {
      // console.log(error);
      setError(error);
    }
  }, [aprovado, openPindurar, openPagamento]);

  let mainJsx = <Loading />;

  if (error) {
    mainJsx = <Error>{error}</Error>;
  }

  if (!loading && !error) {
    mainJsx = (
      <div className='container flex flex-col'>
        <div className='container flex justify-evenly flex-wrap my-4 '>
          <button
            className='w-32 lg:w-36 border-2 text-center p-2 cursor-pointer m-3 md:m-0'
            onClick={() => handlePinduradosExtrato()}
          >
            Pindurados (extrato)
          </button>
          <button
            className='w-32 lg:w-36 border-2 text-center p-2 cursor-pointer m-3 md:m-0'
            onClick={() => handlePindurarDialogOpen()}
          >
            Pindurar
          </button>
          <button
            className='w-32 lg:w-36  border-2 text-center p-2 cursor-pointer m-3 md:m-0'
            onClick={() => handlePagamentoDialogOpen()}
          >
            Lançar pagamentos
          </button>
        </div>
        {/* LISTA DE APROVAÇÃO RÁPIDA */}
        {aprovar.length !== 0 && (
          <div className=' flex flex-col m-4'>
            <div className='text-center p-4 bg-[#918639] font-bold text-lg tracking-[4px]'>
              Aprovação Rápida
            </div>
            <div className='flex flex-col'>
              <>
                <div className='flex flex-col'>
                  <div className={`flex bg-[#beb56c] items-center  `}>
                    <div className='flex-1 flex justify-between items-center py-2 px-2 lg:px-5   '>
                      <div className='flex-1 '>Descrição</div>
                      <div className='hidden md:flex md:flex-1 text-center'>
                        Credor
                      </div>
                      <div className='w-10 text-center'>Qtde.</div>
                      <div className='w-12 text-center'>Valor</div>
                    </div>
                    <div className='w-18'>
                      <div className='h-10 w-10 px-3 m-1 '></div>
                    </div>
                  </div>
                </div>

                {aprovar.map((pindura, index) => {
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
                          {pindura.vendedor.nome}
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
                            const data = {
                              id: pindura.id,
                              aceite_consumidor: 1,
                            };
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
        )}
        {/* FIM LISTA DE APROVAÇÃO RÁPIDA */}

        {/* LISTA DE EXTRATO */}
        {viewExtrato && (
          <ExtratoFinanceiro extrato={extrato} total={formatCurrency(total)} />
        )}
        {/* FIM LISTA DE EXTRATO */}
        {/* MODAL PINDURAR */}
        <Pindurar open={openPindurar} setOpen={handleOnClosePindurar} />
        {/* FIM MODAL PINDURAR */}
        {/* MODAL PAGAMENTO */}
        <Pagamento
          open={openPagamento}
          setOpen={handleOnClosePagamento}
          data={fornecedores}
          titulo={'Fornecedores'}
          submit={onSubmitPindurar}
        />
        {/* FIM MODAL PAGAMENTO */}
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

export default Pindura;
