import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';

import { api } from '../services/api';
import { Header } from '../components/header';
import { Main } from '../components/main';
import { Footer } from '../components/footer';
import { Card } from '../components/card';
import { Loading } from '../components/loading';
import { Button } from '../components/button';
import { Error } from '../components/error';

function Perfil() {
  const [userID, setUserID] = useState(localStorage.getItem('id'));
  const [dataUser, setDataUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const schema = yup.object().shape({
    nome: yup
      .string()
      .min(10, 'Mínimo 10 caracteres')
      .required('Campo obrigatório'),
    email: yup
      .string()
      .email('E-mail não é válido')
      .required('Campo obrigatório'),
    telefone: yup
      .string()
      .min(10, 'Mínimo 10 caracteres')
      .required('Campo obrigatório'),
    cpf: yup
      .string()
      .min(11, 'Mínimo 11 caracteres')
      .required('Campo obrigatório'),
  });

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      empreendedor: '',
    },
  });

  useEffect(() => {
    async function getUsers() {
      try {
        const { data } = await api
          .get(`/usuarios/${userID}`)
          .catch(function (err) {
            // console.log(err.response.data.error);
            alert(err.response.data.error);
          });
        setDataUser(data);
        setValue('nome', data.nome);
        setValue('email', data.email);
        setValue('telefone', data.telefone);
        setValue('cpf', data.cpf);
        setValue('empreendedor', data.empreendedor);
      } catch (error) {
        // console.log(error.message);
        setError(error.message);
      }

      setLoading(false);
    }
    getUsers();
  }, []);

  const onSubmit = async formData => {
    const empreendedor = formData.empreendedor ? 1 : 0;
    const ativo = dataUser.ativo ? 1 : 0;

    const user = {
      id: userID,
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      cpf: formData.cpf,
      empreendedor: empreendedor,
      ativo: ativo,
    };

    const data = await api.put(`/usuarios`, user).catch(function (err) {
      // console.log('Alert: ', err.response.data.error);
      alert(err.response.data.error);
    });

    if (data !== undefined) {
      localStorage.setItem('empreendedor', formData.empreendedor);
      alert('Dados alterados!');
    }
  };
  // console.log(` ${error}`);

  let mainJsx = <Loading />;

  if (error) {
    mainJsx = <Error>{error}</Error>;
  }

  if (!loading && !error) {
    mainJsx = (
      <>
        <Card titulo='PERFIL' containerClassName='w-4/5 my-3'>
          <>
            <div className='flex justify-center'>
              <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                <div className='py-1'>
                  <label
                    htmlFor='nome'
                    className='px-1 font-bold text-xs cursor-pointer'
                  >
                    Nome
                  </label>
                  <input
                    id='nome'
                    {...register('nome')}
                    className='w-full border-2 py-1 px-4 rounded-lg '
                  />
                  <p className='text-xs font-semibold px-3 text-red-700'>
                    {errors.nome?.message}
                  </p>
                </div>
                <div className='py-1'>
                  <label
                    htmlFor='email'
                    className='px-1 font-bold text-xs cursor-pointer'
                  >
                    E-mail
                  </label>
                  <input
                    id='email'
                    {...register('email')}
                    className='w-full border-2 py-1 px-4 rounded-lg '
                  />
                  <p className='text-xs font-semibold px-3 text-red-700'>
                    {errors.email?.message}
                  </p>
                </div>
                <div className='py-2'>
                  <label
                    htmlFor='telefone'
                    className='px-1 font-bold text-xs cursor-pointer'
                  >
                    Telefone
                  </label>
                  <input
                    id='telefone'
                    {...register('telefone')}
                    className='w-full border-2 py-1 px-4 rounded-lg '
                  />
                  <p className='text-xs font-semibold px-3 text-red-700'>
                    {errors.telefone?.message}
                  </p>
                </div>
                <div className='py-2'>
                  <label
                    htmlFor='cpf'
                    className='px-1 font-bold text-xs cursor-pointer'
                  >
                    CPF
                  </label>
                  <input
                    id='cpf'
                    {...register('cpf')}
                    className='w-full border-2 py-1 px-4 rounded-lg'
                  />
                  <p className='text-xs font-semibold px-3 text-red-700'>
                    {errors.cpf?.message}
                  </p>
                </div>
                <div className='py-2'>
                  <label
                    htmlFor='empreendedor'
                    className='px-1 font-bold text-xs cursor-pointer'
                  >
                    Empreendedor
                  </label>
                  <input
                    id='empreendedor'
                    type='checkbox'
                    {...register('empreendedor')}
                    className='border-2 py-1 px-4 rounded-lg'
                  />
                  <p className='text-xs font-semibold px-3 text-red-700'>
                    {errors.empreendedor?.message}
                  </p>
                </div>

                <Button title='ENVIAR' containerClassName='mt-3 w-full' />
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

export default Perfil;
