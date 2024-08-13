import { useAuth } from '../hooks/useAuth';

function Error({ children }) {
  const { message, name, code, config, request, response } = children;
  const { handleSignOut } = useAuth();
  // console.log('response ERROR');

  if (response.status === 500) {
    handleSignOut();
  }

  return (
    <div className='bg-red-300 text-red-900 font-semibold text-center p-2'>
      {message}
    </div>
  );
}

export { Error };
