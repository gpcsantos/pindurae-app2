import { Header } from '../components/header';
import { Main } from '../components/main';
import { Footer } from '../components/footer';

function NotFound() {
  return (
    <>
      <Header />
      <Main containerClassName='flex flex-col justify-center items-center container h-96'>
        <h1 className='font-bold text-3xl mb-5'>PAGE</h1>
        <h1 className='font-bold text-5xl'>NOT FOUND</h1>
      </Main>
      <Footer />
    </>
  );
}

export default NotFound;
