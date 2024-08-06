import { useState, useEffect } from 'react';
import { api } from '../services/api';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { DialogoComponent } from './dialogo_component';
// import { ExtratoFinanceiro } from './extrato';
import { orderAlfabetc } from '../utils/utils';

function Vender({ open, setOpen }) {
  const userID = localStorage.getItem('id');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [produtos, setProdutos] = useState([]);

  // ********************************
  //        Dialogo Vender
  // ********************************
  const schema = yup
    .object()
    .shape({
      usuarios: yup.string().required('Campo obrigatório'),
      produto: yup.string().required('Campo obrigatório'),
      preco: yup
        .number()
        .typeError(
          'Deve ser um número. Use ponto como separadador de casa decimal'
        )
        .required('Campo obrigatório')
        .test(
          'is-decimal',
          'Use ponto como separadador de casa decimal',
          value => (value + '').match(/^\d*\.?\d*$/)
        ),
      quantidade: yup
        .number()
        .typeError('Deve ser um número inteiro')
        .required('Campo obrigatório'),
    })
    .required();

  const {
    reset,
    resetField,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      usuarios: 0,
      produto: 0,
      preco: '',
      quantidade: '',
    },
  });

  //finaliza processo de pindurar
  async function onSubmitPindurar(formData) {
    const pindura = {
      compradorId: formData.usuarios,
      vendedorId: userID,
      quantidade: formData.quantidade,
      valor_total: formData.quantidade * formData.preco * -1,
      aceite_consumidor: 0,
      aceite_empreendedor: 1,
      produtoId: formData.produto,
    };

    const data = await api.post(`/pindura`, pindura).catch(function (err) {
      console.log(err);
      alert(err.response.data.error);
    });
    reset();
    // getExtrato();
    if (data) {
      alert('Produto adicionado. Adicionar novo?');
    }
  }

  // busca lista de Usuários em geral
  async function getUsuarios() {
    try {
      const users = await api.get(`/usuarios`).catch(function (err) {
        console.log(err);
        alert(err.response.data.error);
      });
      setUsers(users.data);

      const products = await api
        .get(`/produtos/usuario/${userID}`)
        .catch(function (err) {
          console.log(err);
          // alert(err.response.data.error);
        });

      const p = orderAlfabetc(products.data);
      setProdutos(p);
    } catch (error) {
      // console.log(error.message);
      setError(error.message);
    }
  }

  // busca lista de produtos de um fornecedor
  async function handleFiltraProdutos(id) {
    const productsSupplier = await api
      .get(`/produtos/usuario/${id}`)
      .catch(function (err) {
        console.log(err);
        // alert(err.response.data.error);
      });

    const p = orderAlfabetc(productsSupplier.data);
    setProdutos(p);
    resetField('produto', { defaultValue: 0 });
    setValue('preco', p[0].preco);
    setValue('quantidade', '');
  }

  // preenche preco unitário sugerido
  function handleFiltraPreco(index) {
    setValue('preco', produtos[index].preco);
  }

  // ********************************
  //     FIM Dialogo Vender
  // ********************************

  useEffect(() => {
    try {
      getUsuarios();
    } catch (error) {
      console.log(error);
      setError(error);
    }
  }, []);

  return (
    <>
      <DialogoComponent open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(onSubmitPindurar)}>
          <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
            <div className='sm:flex sm:items-start'>
              <div className='mt-3 flex flex-col items-center sm:ml-4 sm:mt-0 sm:text-left'>
                <h3 className='text-base font-semibold leading-6 text-gray-900'>
                  VENDER
                </h3>
                <div className='mt-2'>
                  <div className='py-1'>
                    <label
                      htmlFor='usuarios'
                      className='px-1 font-bold text-xs cursor-pointer'
                    >
                      Consumidores
                    </label>
                    <select
                      {...register('usuarios')}
                      className='w-full border-2 py-1 px-4 rounded-lg '
                    >
                      {users.map((usuario, index) => (
                        <option key={index} value={usuario.id}>
                          {usuario.nome}
                        </option>
                      ))}
                    </select>
                    <p className='text-xs font-semibold px-3 text-red-700'>
                      {errors.usuario?.message}
                    </p>
                  </div>
                  <div className='py-1'>
                    <label
                      htmlFor='produto'
                      className='px-1 font-bold text-xs cursor-pointer'
                    >
                      Produtos
                    </label>
                    <select
                      {...register('produto')}
                      className='w-full border-2 py-1 px-4 rounded-lg '
                      onChange={val => {
                        handleFiltraPreco(val.target.selectedIndex);
                      }}
                    >
                      {produtos.map((produto, index) => (
                        <option key={index} value={produto.id}>
                          {produto.descricao}
                        </option>
                      ))}
                    </select>
                    <p className='text-xs font-semibold px-3 text-red-700'>
                      {errors.produto?.message}
                    </p>
                  </div>
                  <div className='py-1'>
                    <label
                      htmlFor='quantidade'
                      className='px-1 font-bold text-xs cursor-pointer'
                    >
                      Preço unitário sugerido
                    </label>
                    <input
                      {...register('preco')}
                      className='w-full border-2 py-1 px-4 rounded-lg '
                    />
                    <p className='text-xs font-semibold px-3 text-red-700'>
                      {errors.preco?.message}
                    </p>
                  </div>
                  <div className='py-1'>
                    <label
                      htmlFor='quantidade'
                      className='px-1 font-bold text-xs cursor-pointer'
                    >
                      Quantidade
                    </label>
                    <input
                      {...register('quantidade')}
                      className='w-full border-2 py-1 px-4 rounded-lg '
                    />

                    <p className='text-xs font-semibold px-3 text-red-700'>
                      {errors.quantidade?.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='bg-gray-100 px-4 py-3  flex justify-end'>
            <button className='bg-transparent hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-1 px-4 border border-yellow-500 hover:border-transparent rounded-lg ml-3 sm:w-auto'>
              Salvar
            </button>
            <button
              type='button'
              data-autofocus
              onClick={() => {
                setOpen(false);
                reset();
              }}
              className='bg-transparent hover:bg-red-600 text-red-900 font-semibold hover:text-red-100 py-1 px-4 border border-red-600 hover:border-transparent rounded-lg ml-3 sm:w-auto'
            >
              Cancelar
            </button>
          </div>
        </form>
      </DialogoComponent>
    </>
  );
}
export { Vender };
