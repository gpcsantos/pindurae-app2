import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Input } from '../components/input';
import { Button } from '../components/button';
import logo from '../assets/images/logo.png';
import { api } from '../services/api';

const schema = yup
  .object({
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
    password: yup
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .required('Campo obrigatório'),
    passwordConfirmation: yup
      .string()
      .required('Campo obrigatório')
      .oneOf([yup.ref('password')], 'As senhas devem ser iguais'),
  })
  .required();

function Cadastro() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async formData => {
    const data = await api
      .post('/usuarios/cadastro', {
        email: formData.email,
        nome: formData.nome,
        telefone: formData.telefone,
        senha: formData.password,
      })
      .catch(function (e) {
        alert(e.response.data.error);
      });

    if (data) {
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    }
  };

  return (
    <div className='h-screen w-screen bg-[#fff186] flex justify-center items-center'>
      <div className='w-80 bg-white rounded-xl '>
        <div className='bg-[#ffe200] py-4 rounded-t-xl flex justify-center items-center'>
          <Link to='/' className='flex justify-center items-center'>
            <img src={logo} alt='Logo Pinduraê' className='w-4/5' />
          </Link>
        </div>
        <div className='text-center pt-5 font-bold text-2xl tracking-[15px] text-yellow-700'>
          CADASTRO
        </div>
        <div className='m-4'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              name='nome'
              control={control}
              label='Nome Completo'
              errorMessage={errors?.nome?.message}
            />
            <Input
              name='email'
              control={control}
              label='E-mail'
              errorMessage={errors?.email?.message}
            />
            <Input
              name='telefone'
              control={control}
              label='Telefone Whatsapp'
              errorMessage={errors?.telefone?.message}
            />
            <Input
              name='password'
              type='password'
              label='Senha'
              control={control}
              errorMessage={errors?.password?.message}
            />
            <Input
              name='passwordConfirmation'
              type='password'
              label='Confirme sua Senha'
              control={control}
              errorMessage={errors?.passwordConfirmation?.message}
            />
            <Button title='CADASTRAR' containerClassName='mt-4 w-full' />
          </form>
          <a
            href='/'
            className='mt-2 block text-center bg-transparent hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-1 px-4 border border-yellow-500 hover:border-transparent rounded-lg w-full'
          >
            HOME
          </a>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
