import { cn } from '../utils/utils';

const Button = ({
  title = 'Title Default',
  onClick,
  containerClassName = '',
  ...rest
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'bg-transparent hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-1 px-4 border border-yellow-500 hover:border-transparent rounded-lg',
        containerClassName
      )}
      {...rest}
    >
      {title}
    </button>
  );
};
export { Button };
