import { par, formatCurrency } from '../utils/utils';

function ExtratoFinanceiro({ extrato, total }) {

  extrato.sort((a, b) => {
    return a.vendedor.id - b.vendedor.id;
  });

  const totais = [];
  let sum = 0;
  for (var i = 0, len = extrato.length; i < len; i++) {
    sum += parseFloat(extrato[i].valor_total);
    if (i < len - 1) {
      if (extrato[i].vendedor.id !== extrato[i + 1].vendedor.id) {
        totais.push({
          idVendedor: extrato[i].vendedor.id,
          total: parseFloat(sum.toFixed(2)),
        });
        sum = 0;
      }
    }
    if (i === len - 1) {
      totais.push({
        idVendedor: extrato[i].vendedor.id,
        total: parseFloat(sum.toFixed(2)),
      });
    }
  }
  let flag = 0;

  return (
    <>
      <div className=' flex flex-col m-4'>
        <div className='text-center p-4 bg-[#918639] font-bold text-lg tracking-[4px]'>
          Extrato - Pindurados
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
                  <div className='w-12 text-center'>Qtde.</div>
                  <div className='w-16 text-center'>Valor</div>
                </div>
              </div>
            </div>

            {extrato.map((pindura, index, { length }) => {
              let cn;
              let data;

              par(index) ? (cn = 'bg-[#beb56c]') : (cn = '');
              // console.log('pindura.usuario.id: ', pindura.usuario.id);
              // console.log('totais[i].idVendedor: ', totais[flag].idVendedor);
              // console.log('flag: ', flag);
              if (pindura.vendedor.id === totais[flag].idVendedor) {
                data = (
                  <div
                    className={`flex  ${cn} items-center  hover:font-semibold hover:text-orange-900 hover:bg-opacity-80`}
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
                      <div className='w-12 text-center'>
                        {pindura.quantidade}
                      </div>
                      <div className='w-16 text-center'>
                        {formatCurrency(parseFloat(pindura.valor_total))}
                      </div>
                    </div>
                  </div>
                );
              } else {
                data = (
                  <>
                    <div className='flex flex-col'>
                      <div className={`flex bg-[#beb56c] items-center  `}>
                        <div className='flex-1 flex justify-between items-center py-2 px-2 lg:px-5  text-lg font-bold  '>
                          <div className='flex-1 text-center'>TOTAL</div>
                          <div className='w-12 text-center'>R$</div>
                          <div className='w-16 text-center '>
                            {formatCurrency(totais[flag].total)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex  ${cn} items-center  hover:font-semibold hover:text-orange-900 hover:bg-opacity-80`}
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
                        <div className='w-12 text-center'>
                          {pindura.quantidade}
                        </div>
                        <div className='w-16 text-center'>
                          {formatCurrency(parseFloat(pindura.valor_total))}
                        </div>
                      </div>
                    </div>
                  </>
                );
                flag++;
              }

              return (
                <div key={index}>
                  {data}
                  {length - 1 === index && (
                    <div className='flex flex-col'>
                      <div className={`flex bg-[#beb56c] items-center  `}>
                        <div className='flex-1 flex justify-between items-center py-2 px-2 lg:px-5  text-lg font-bold  '>
                          <div className='flex-1 text-center'>TOTAL</div>
                          <div className='w-12 text-center'>R$</div>
                          <div className='w-16 text-center '>
                            {formatCurrency(totais[flag].total)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        </div>
      </div>
    </>
  );
}
export { ExtratoFinanceiro };
