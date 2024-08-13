import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import logo from '../assets/images/logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);
  const { authenticated, handleSignOut } = useAuth();
  const isEmpreendedor = localStorage.getItem('empreendedor') === 'true';

  let cn;
  // console.log(`authenticated: ${authenticated}`);
  if (authenticated) {
    cn = 'hidden md:flex flex-1 justify-evenly';
  } else {
    cn = 'hidden md:flex flex-1 justify-end';
  }

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: 'Início', link: '/inicio', acesso: [] },
    { id: 2, text: 'Pindura', link: '/pindura', acesso: [] },
    { id: 3, text: 'Clientes', link: '/clientes', acesso: ['empreendedor'] },
    { id: 4, text: 'Produtos', link: '/produtos', acesso: ['empreendedor'] },
    { id: 5, text: 'Perfil', link: '/perfil', acesso: [] },
  ];

  return (
    <div className='container flex justify-between items-center h-24  mx-auto px-4 text-black font-semibold'>
      {/* Logo */}
      <div className='md:w-40 text-3xl font-bold text-black mx-3'>
        {authenticated ? (
          <a href='/'>
            {' '}
            <img src={logo} alt='logo Pinduraê' className=' max-h-20 w-auto' />
          </a>
        ) : (
          <a href='/'>
            {' '}
            <img src={logo} alt='logo Pinduraê' />
          </a>
        )}
      </div>

      {/* Desktop Navigation */}
      <ul className={cn}>
        {authenticated &&
          navItems.map(item =>
            item.acesso.indexOf('empreendedor') === -1 ? (
              <li
                key={item.id}
                className='px-4 pt-4 pb-1 m-2 cursor-pointer hover:text-black  hover:border-b-2 hover:border-black'
              >
                <a href={item.link}> {item.text}</a>
              </li>
            ) : (
              isEmpreendedor && (
                <li
                  key={item.id}
                  className='px-4 pt-4 pb-1 m-2 cursor-pointer hover:text-black  hover:border-b-2 hover:border-black'
                >
                  <a href={item.link}> {item.text}</a>
                </li>
              )
            )
          )}

        <li className='px-4 pt-4 pb-1 m-2 cursor-pointer hover:text-black  hover:border-b-2 hover:border-black'>
          {authenticated ? (
            <a href='#' onClick={handleSignOut}>
              {' '}
              Logout
            </a>
          ) : (
            <a href='/login'> Login</a>
          )}
        </li>
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className='block md:hidden'>
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? 'fixed md:hidden left-0 top-28 w-[70%] h-full border-r border-r-gray-900 bg-[#FFE200] ease-in-out duration-500'
            : 'ease-in-out w-[70%] duration-500 fixed top-0 bottom-0 left-[-100%]'
        }
      >
        {/* Mobile Logo */}
        {/* <h1 className='w-full text-3xl font-bold text-[#00df9a] m-4'>REACT.</h1> */}

        {/* Mobile Navigation Items */}
        {authenticated &&
          navItems.map(item =>
            item.acesso.indexOf('empreendedor') === -1 ? (
              <li
                key={item.id}
                className='px-4 pt-4 pb-1 m-2 cursor-pointer hover:text-black  hover:border-b-2 hover:border-black'
              >
                <a href={item.link}> {item.text}</a>
              </li>
            ) : (
              isEmpreendedor && (
                <li
                  key={item.id}
                  className='px-4 pt-4 pb-1 m-2 cursor-pointer hover:text-black  hover:border-b-2 hover:border-black'
                >
                  <a href={item.link}> {item.text}</a>
                </li>
              )
            )
          )}

        <li className='px-4 pt-4 pb-1 m-2 cursor-pointer hover:text-black  hover:border-b-2 hover:border-black'>
          {authenticated ? (
            <a href='#' onClick={handleSignOut}>
              {' '}
              Logout
            </a>
          ) : (
            <Link to='/login'>Login</Link>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
