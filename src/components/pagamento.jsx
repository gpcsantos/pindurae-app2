import { api } from '../services/api';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { DialogoComponent } from './dialogo_component';

function Pagamento({ open, setOpen, data, titulo, submit }) {
  const userID = localStorage.getItem('id');

  // ********************************
  //        Dialogo Pagamento
  // ********************************
  const schema = yup
    .object()
    .shape({
      valor: yup
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      valor: '',
      observacao: '',
    },
  });

  //finaliza processo de pindurar
  // async function onSubmitPindurar(formData) {
  //   const pagamento = {
  //     valor_total: formData.valor,
  //     observacao: formData.observacao,
  //   };
  //   if (titulo === 'Fornecedores') {
  //     (pagamento.compradorId = userID),
  //       (pagamento.vendedorId = formData.fornecedor),
  //       (pagamento.aceite_consumidor = 1);
  //     pagamento.aceite_empreendedor = 0;
  //   }
  //   if (titulo === 'Clientes') {
  //     (pagamento.compradorId = formData.fornecedor),
  //       (pagamento.vendedorId = userID),
  //       (pagamento.aceite_consumidor = 0);
  //     pagamento.aceite_empreendedor = 1;
  //   }
  //   console.log(pagamento);

  //   const data = await api.post(`/pindura`, pagamento).catch(function (err) {
  //     // console.log(err);
  //     alert(err.response.data.error);
  //   });
  //   reset();

  //   if (data) {
  //     alert('Pagamento adicionado!');
  //   }
  // }
  // recebe função sbmit com PROPS do componente
  async function onSubmit(formData) {
    submit(formData);
    reset();
  }

  return (
    <>
      <DialogoComponent open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
            <div className='sm:flex sm:items-start'>
              <div className='mt-3 flex flex-col items-center sm:ml-4 sm:mt-0 sm:text-left'>
                <h3 className='text-base font-semibold leading-6 text-gray-900'>
                  Pagamento
                </h3>
                <div className='mt-2'>
                  <div className='py-1'>
                    <label
                      htmlFor='select'
                      className='px-1 font-bold text-xs cursor-pointer'
                    >
                      {titulo}
                    </label>
                    <select
                      id='select'
                      {...register('select')}
                      className='w-full border-2 py-1 px-4 rounded-lg '
                    >
                      {data.length !== 0 &&
                        data.map((d, index) => (
                          <option key={index} value={d.id}>
                            {d.nome}
                          </option>
                        ))}
                    </select>
                    <p className='text-xs font-semibold px-3 text-red-700'>
                      {errors.d?.message}
                    </p>
                  </div>
                  <div className='py-1'>
                    <label
                      htmlFor='valor'
                      className='px-1 font-bold text-xs cursor-pointer'
                    >
                      Valor
                    </label>
                    <input
                      id='valor'
                      {...register('valor')}
                      className='w-full border-2 py-1 px-4 rounded-lg '
                    />
                    <p className='text-xs font-semibold px-3 text-red-700'>
                      {errors.valor?.message}
                    </p>
                  </div>
                  <div className='py-1'>
                    <label
                      htmlFor='observacao'
                      className='px-1 font-bold text-xs cursor-pointer'
                    >
                      Observação
                    </label>
                    <input
                      id='observacao'
                      {...register('observacao')}
                      className='w-full border-2 py-1 px-4 rounded-lg '
                    />
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
export { Pagamento };
