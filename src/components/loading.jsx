import ReactLoading from 'react-loading';

function Loading() {
  return (
    <div className='flex flex-col justify-center items-center'>
      <ReactLoading
        type='spinningBubbles'
        color='#eab308'
        height={100}
        width={100}
      />
      <p className='text-[#eab308]'>Loading...</p>
    </div>
  );
}
export { Loading };
