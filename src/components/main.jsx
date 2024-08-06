import { cn } from '../utils/utils';

function Main({ children, containerClassName = '' }) {
  return (
    <main className={cn('container mx-auto bg-slate-100', containerClassName)}>
      {children}
    </main>
  );
}

export { Main };
