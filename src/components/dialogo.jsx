import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';

import { api } from '../services/api';

function Dialogo(openD) {
  if (!openD) return null;
  const { open, setOpen, data } = openD;

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
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      id: '',
      descricao: '',
      preco: '',
    },
  });

  useEffect(() => {
    reset({ descricao: '', preco: '', id: '' });

    setValue('id', data.id);
    setValue('descricao', data.descricao);
    setValue('preco', data.preco);
  }, [open]);

  const onSubmit = async formData => {
    const produto = {
      id: parseInt(formData.id),
      descricao: formData.descricao,
      preco: parseFloat(formData.preco),
    };
    const result = await api.put(`/produtos`, produto).catch(err => {
      console.log('Alert: ', err.response.data.erro);
      const e = err.response.data.erro;
      console.log(e);
      for (const [key, value] of Object.entries(e)) {
        // console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
        alert(value.msg);
      }
    });

    if (result !== undefined) {
      // alert('Produto Alterado!');
      reset({ descricao: '', preco: '', id: '' });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onClose={setOpen} className='relative z-10'>
      <DialogBackdrop
        transition
        className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in'
      />

      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
          <DialogPanel
            transition
            className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95'
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                <div className='sm:flex sm:items-start'>
                  <div className='mt-3 flex flex-col items-center sm:ml-4 sm:mt-0 sm:text-left'>
                    <DialogTitle
                      as='h3'
                      className='text-base font-semibold leading-6 text-gray-900'
                    >
                      Alterar produto
                    </DialogTitle>
                    <div className='mt-2'>
                      <input type='hidden' id='id' {...register('id')} />
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
                  onClick={() => setOpen(false)}
                  className='bg-transparent hover:bg-red-600 text-red-900 font-semibold hover:text-red-100 py-1 px-4 border border-red-600 hover:border-transparent rounded-lg ml-3 sm:w-auto'
                >
                  Cancelar
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export { Dialogo };
