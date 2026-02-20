'use client';

import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className='bg-white shadow-md sticky top-0 z-50'>
      <nav className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
        <Link href='/' className='group'>
          <div className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
            <span className='text-2xl'>⚡</span>
            <h1 className='text-xl font-bold text-gray-400'>Hızlı Okuma</h1>
          </div>
        </Link>

        <div className='flex items-center gap-6'>
          <Link href='/' className='text-gray-700 hover:text-blue-600 transition-colors'>
            Anasayfa
          </Link>
          <Link href='/exercises' className='text-gray-700 hover:text-blue-600 transition-colors'>
            Egzersizler
          </Link>
          <Link href='/progress' className='text-gray-700 hover:text-blue-600 transition-colors'>
            İlerleme
          </Link>
          <Link 
            href='/exercises' 
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Başla
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
