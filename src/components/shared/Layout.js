import React from 'react';
import Header from './Header';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';

export default function Layout({ children }) {

  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };


  // You might want to set this based on the actual height of your header
  const headerHeight = '64px'; // Example height, adjust as needed

  return (
    <section className='relative'>
      <Header toggleNavbar={toggleNavbar} />
      <Navbar isOpen={isNavbarOpen} headerHeight={headerHeight} />
      <div className={`${isNavbarOpen ? 'ml-40' : ''} mx-auto xl:ml-xs3 xl:pl-4`}>

        {children}
      </div>

    </section>
  );
}

