import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '../services/api';
import { Header } from '../components/header';
import { Main } from '../components/main';
import { Footer } from '../components/footer';
import { Card } from '../components/card';
import { Button } from '../components/button';
import { Error } from '../components/error';

function ProdutoNovo() {
  const [userID, setUserID] = useState(localStorage.getItem('id'));
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const schema = yup
    .object()
    .shape({
      descricao: yup
        .string()
        .min(5, 'Mínimo 5 caracteres')
        .required('Campo obrigatório'),
      // preco: yup.string().required('Campo obrigatório'),
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
    })
    .required();

  const {
    reset,
    register,
    handleSubmit,
    submittedData,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      descricao: '',
      preco: '',
    },
  });

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ descricao: '', preco: '' });
    }
  }, [formState, submittedData, reset]);

  const onSubmit = async formData => {
    const produto = {
      usuarioId: parseInt(userID),
      descricao: formData.descricao,
      preco: parseFloat(formData.preco),
    };
    const result = await api.post(`/produtos`, produto).catch(err => {
      console.log('Alert: ', err.response.data.erro);
      const e = err.response.data.erro;
      console.log(e);
      for (const [key, value] of Object.entries(e)) {
        console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
        alert(value.msg);
      }
    });
    console.log(`result: ${result}`);

    if (result !== undefined) {
      alert('Produto inserido!');
      return true;
    }
  };

  function handleVoltar() {
    navigate(-1);
  }

  let mainJsx;

  if (error) {
    mainJsx = <Error>{error}</Error>;
  }

  if (!error) {
    mainJsx = (
      <>
        <Card titulo='Novo Produto' containerClassName='w-4/5 my-3'>
          <>
            <div className='flex justify-center'>
              <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                <div className='py-1'>
                  <label
                    htmlFor='descricao'
                    className='px-1 font-bold text-xs cursor-pointer'
                  >
                    Descrição
                  </label>
                  <input
                    id='descricao'
                    {...register('descricao')}
                    className='w-full border-2 py-1 px-4 rounded-lg '
                  />
                  <p className='text-xs font-semibold px-3 text-red-700'>
                    {errors.descricao?.message}
                  </p>
                </div>
                <div className='py-1'>
                  <label
                    htmlFor='preco'
                    className='px-1 font-bold text-xs cursor-pointer'
                  >
                    Preço
                  </label>
                  <input
                    id='preco'
                    {...register('preco')}
                    className='w-full border-2 py-1 px-4 rounded-lg '
                  />
                  <p className='text-xs font-semibold px-3 text-red-700'>
                    {errors.preco?.message}
                  </p>
                </div>

                <Button title='ENVIAR' containerClassName='mt-3 w-full' />
                <Button
                  title='Voltar'
                  containerClassName='mt-3 w-full'
                  type='button'
                  onClick={handleVoltar}
                />
              </form>
            </div>
          </>
        </Card>
      </>
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

export default ProdutoNovo;
