'use client';

import React from 'react';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-gray-900 text-gray-300 py-8 mt-16 ${className}`}>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
          <div>
            <h3 className='text-white font-bold mb-4 flex items-center gap-2'>
              <span className='text-2xl'>⚡</span>
              Hızlı Okuma
            </h3>
            <p className='text-sm'>
              Okuma hızınızı ve anlama yeteneğinizi geliştirmek için tasarlanmış antrenman platformu.
            </p>
          </div>

          <div>
            <h4 className='text-white font-bold mb-4'>Bağlantılar</h4>
            <ul className='space-y-2 text-sm'>
              <li><a href='/' className='hover:text-blue-400 transition-colors'>Anasayfa</a></li>
              <li><a href='/exercises' className='hover:text-blue-400 transition-colors'>Egzersizler</a></li>
              <li><a href='/progress' className='hover:text-blue-400 transition-colors'>İlerleme</a></li>
            </ul>
          </div>

          <div>
            <h4 className='text-white font-bold mb-4'>Bilgi</h4>
            <ul className='space-y-2 text-sm'>
              <li><a href='#' className='hover:text-blue-400 transition-colors'>Hakkında</a></li>
              <li><a href='#' className='hover:text-blue-400 transition-colors'>Gizlilik Politikası</a></li>
              <li><a href='#' className='hover:text-blue-400 transition-colors'>Koşul ve Şartlar</a></li>
            </ul>
          </div>
        </div>

        <div className='border-t border-gray-700 pt-8 text-center text-sm'>
          <p>&copy; {currentYear} Hızlı Okuma. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
