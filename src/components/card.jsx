import { cn } from '../utils/utils';

function Card({
  containerClassName = '',
  image = '',
  titulo = 'Título do Card',
  children = 'Corpo',
}) {
  return (
    <div
      className={cn(' rounded overflow-hidden shadow-lg', containerClassName)}
    >
      {image ? (
        <img
          className='w-full'
          src='/img/card-top.jpg'
          alt='Sunset in the mountains'
        />
      ) : (
        <></>
      )}

      <div className='px-6 py-4'>
        <div className='font-bold text-xl mb-2'>{titulo}</div>
        {children}
      </div>
    </div>
  );
}

export { Card };
