import { Header } from '../components/header';
import { Main } from '../components/main';
import { Footer } from '../components/footer';

function Home() {
  return (
    <>
      <Header />
      <Main containerClassName='w-full flex justify-center flex-col'>
        <div className='h-56 flex justify-center items-center  bg-yellow-200'>
          BANER
        </div>
        <div className='flex justify-evenly  w-full h-96 m-2'>
          <div className='bg-slate-500 flex justify-center basis-1/3'>
            coluna 1
          </div>
          <div className='bg-slate-500 flex justify-center basis-1/3'>
            coluna 2
          </div>
        </div>
        <div className='h-48 flex justify-center items-center'>Nova linha</div>
      </Main>
      <Footer />
    </>
  );
}

export default Home;
