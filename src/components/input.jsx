import { Controller } from 'react-hook-form';

const Input = ({ name, control, errorMessage, defaultValue = '', ...rest }) => {
  return (
    <div className='py-1'>
      <div className='w-full'>
        {rest.label ? (
          <label htmlFor={name} className='font-semibold text-xs mx-2 block'>
            {rest.label}
          </label>
        ) : null}

        <Controller
          defaultValue={defaultValue}
          name={name}
          id={name}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <input
              className='w-full border-2 py-2 px-4 rounded-lg'
              {...field}
              {...rest}
            />
          )}
        />
      </div>
      {errorMessage ? (
        <p className='text-xs font-semibold px-3 text-red-700'>
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};
export { Input };
