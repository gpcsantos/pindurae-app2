import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Input } from '../components/input';
import { Button } from '../components/button';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/images/logo.png';

const schema = yup
  .object({
    email: yup
      .string()
      .email('E-mail não é válido')
      .required('Campo obrigatório'),
    password: yup
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .required('Campo obrigatório'),
  })
  .required();

function Login() {
  const { handleLogin } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async formData => {
    handleLogin(formData);
  };

  return (
    <div className='h-screen w-screen bg-[#fff186] flex justify-center items-center'>
      <div className='w-80 bg-white rounded-xl mx-4 '>
        <div className='bg-[#ffe200] py-4 rounded-t-xl'>
          <Link to='/' className='flex justify-center items-center'>
            <img src={logo} alt='Logo Pinduraê' className='w-4/5' />
          </Link>
        </div>
        <div className='text-center pt-5 font-bold text-2xl tracking-[15px] text-yellow-700'>
          LOGIN
        </div>
        <div className='m-4'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              name='email'
              control={control}
              label='E-mail'
              errorMessage={errors?.email?.message}
            />
            <Input
              name='password'
              type='password'
              label='Senha'
              control={control}
              errorMessage={errors?.password?.message}
            />
            <Button title='ENVIAR' containerClassName='mt-4 w-full' />
          </form>
          <a
            href='/cadastro'
            className='mt-2 block text-center bg-transparent hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-1 px-4 border border-yellow-500 hover:border-transparent rounded-lg w-full'
          >
            CADASTRO
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
