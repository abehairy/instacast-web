import react from "react";
import Switch from "react-switch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
export default function Navbar({ isOpen }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const webBaseUrl = process.env.REACT_APP_WEB_BASE_URL;

  // Logout function that redirects to the homepage after logout
  const handleLogout = () => {
    logout({ logoutParams: { returnTo: webBaseUrl } });
  };

  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const localDarkMode = window.localStorage.getItem('darkMode');
    if (localDarkMode) {
      setDarkMode(JSON.parse(localDarkMode));
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return <div className={`${isOpen ? '' : 'hidden'} navbar-menu relative xl:flex xl:flex-col`}>
    {/* (is<div className='navbar-backdrop fixed xl:hidden inset-0 dark:bg-gray-800 opacity-10' /> */}
    <div className='sidebar-container fixed inset-0 max-w-xs3 '>
      <div className='sidebar relative z-10 flex justify-center py-5 border-b'>
        <a className='inline-block' href='#'>
          <img width="32px" src='/dashy-assets/logos/dashy-circle2-logo.png' alt='' />
          <b className="font-jurni">Jurni</b>
          {/* <svg
            width={22}
            height={22}
            viewBox='0 0 22 22'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M3.6665 4.75C3.25229 4.75 2.9165 5.08579 2.9165 5.5C2.9165 5.91421 3.25229 6.25 3.6665 6.25V4.75ZM18.3332 6.25C18.7474 6.25 19.0832 5.91421 19.0832 5.5C19.0832 5.08579 18.7474 4.75 18.3332 4.75V6.25ZM3.6665 10.25C3.25229 10.25 2.9165 10.5858 2.9165 11C2.9165 11.4142 3.25229 11.75 3.6665 11.75V10.25ZM18.3332 11.75C18.7474 11.75 19.0832 11.4142 19.0832 11C19.0832 10.5858 18.7474 10.25 18.3332 10.25V11.75ZM3.6665 15.75C3.25229 15.75 2.9165 16.0858 2.9165 16.5C2.9165 16.9142 3.25229 17.25 3.6665 17.25V15.75ZM18.3332 17.25C18.7474 17.25 19.0832 16.9142 19.0832 16.5C19.0832 16.0858 18.7474 15.75 18.3332 15.75V17.25ZM3.6665 6.25H18.3332V4.75H3.6665V6.25ZM3.6665 11.75H18.3332V10.25H3.6665V11.75ZM3.6665 17.25H18.3332V15.75H3.6665V17.25Z'
              fill='#7F8995'
            />
          </svg> */}
        </a>
      </div>
      <div className='flex-1 flex flex-col py-7 -m-4 overflow-x-hidden overflow-y-auto'>
        <div className='w-full p-4'>
          <Link className='flex flex-col items-center text-center' to='/dashboard'>
            <img
              width={'18%'}
              className='mb-3'
              src='/dashy-assets/images/dashboard.svg'
              alt=''
            />
            <p className='text-sm hover:text-neutral-700 font-medium'>
              LifeBoard
            </p>
          </Link>
        </div>
        <div className='w-full p-4'>
          <Link className='flex flex-col items-center text-center' to='/ask'>
            <img
              width={'18%'}
              className='mb-3'
              src='/dashy-assets/images/ask.svg'
              alt=''
            />
            <p className='text-sm hover:text-neutral-700 font-medium'>
              Ask
            </p>
          </Link>
        </div>
        <div className='w-full p-4'>
          <Link className='flex flex-col items-center text-center' to='/lifegraph/viewer'>
            <img
              width={'25%'}
              className='mb-3'
              src='/dashy-assets/images/lifegraph.svg'
              alt=''
            />
            <p className='text-sm hover:text-neutral-700 font-medium'>
              LifeGraph
            </p>
          </Link>
        </div>
        {/* <div className='w-full p-4'>
          <Link className='flex flex-col items-center text-center' to='/journal'>
            <img
              className='mb-3'
              src='/dashy-assets/images/pencil-alt.svg'
              alt=''
            />
            <p className='text-sm hover:text-neutral-700 font-medium'>
              Journal
            </p>
          </Link>
        </div> */}
        <div className='w-full p-4'>
          <Link className='flex flex-col items-center text-center' to='/apps'>
            <img
              width={'15%'}
              className='mb-3'
              src='/dashy-assets/images/data-center.svg'
              alt=''
            />
            <p className='text-sm hover:text-neutral-700 font-medium'>
              Data
            </p>
          </Link>
        </div>
        {/* <div className='w-full p-4'>
          <Link className='flex flex-col items-center text-center' to='/companions'>
            <img
              className='mb-3'
              src='/dashy-assets/images/happy.png'
              alt=''
            />
            <p className='text-sm hover:text-neutral-700 font-medium'>
              Companions
            </p>
          </Link>
        </div> */}
        {/* <div className='w-full p-4'>
          <Link className='flex flex-col items-center text-center' to='#'>
            <img
              className='mb-3'
              src='/dashy-assets/images/translate.svg'
              alt=''
            />
            <p className='text-sm hover:text-neutral-700 font-medium'>
              Texts
            </p>
          </Link>
        </div>
        <div className='w-full p-4'>
          <a className='flex flex-col items-center text-center' href='#'>
            <img
              className='mb-3'
              src='/dashy-assets/images/plus-circle.svg'
              alt=''
            />
            <p className='text-sm hover:text-neutral-700 font-medium'>
              Uploads
            </p>
          </a>
        </div> */}
        {/* <div className='w-full p-4'>
          <a className='flex flex-col items-center text-center' href='#'>

            <p className='text-sm hover:text-neutral-700 font-medium'>
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                offColor="#D9D9D9"
                onColor="#333"
                height={25}
                width={48}
                uncheckedIcon={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      fontSize: 15,
                      paddingLeft: 2
                    }}
                  >
                    <FontAwesomeIcon icon={faSun} />
                  </div>
                }
                checkedIcon={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      fontSize: 15,
                      paddingRight: 2
                    }}
                  >
                    <FontAwesomeIcon icon={faMoon} />
                  </div>
                }
              />
            </p>
          </a>
        </div> */}
        <div className='w-full p-4'>
          <a className='flex flex-col items-center text-center' href='#'>

            {isAuthenticated && (
              <button onClick={() => handleLogout()} className="inline-flex flex-wrap items-center px-5 py-3.5 text-sm text-neutral-50 font-medium bg-black hover:bg-gradient-purple-left-dark rounded-lg transition duration-300">Log out</button>
            )}
          </a>
        </div>







      </div>
    </div>
  </div>;
}