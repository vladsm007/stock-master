"use client"
import React, { useState } from 'react';
import { 
  FaTh, 
  FaList, 
  FaBox, 
  FaTag, 
  FaTruck, 
  FaSignOutAlt,
  FaBars,
  FaTimes 
} from 'react-icons/fa';

const menuItems = [
  { icon: FaTh, label: 'Dashboard', href: '#' },
  { icon: FaList, label: 'Categorias', href: '#' },
  { icon: FaBox, label: 'Estoque', href: '#' },
  { icon: FaTag, label: 'Produtos', href: '#' },
  { icon: FaTruck, label: 'Fornecedores', href: '#' },
  { icon: FaSignOutAlt, label: 'Sair', href: '#' },
];

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Header - Alinhado à esquerda */}
      <div className="md:hidden flex items-center gap-2 p-4 bg-blue-600 text-white">
        <button onClick={toggleMenu} className="text-xl focus:outline-none">
          <FaBars />
        </button>
        <h1 className="text-xl font-bold">MENU</h1>
      </div>

      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-opacity-50 z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative
        top-0 left-0
        h-full
        bg-blue-600
        text-white
        transition-transform duration-300 ease-in-out
        z-50
        w-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Botão de fechar dentro da sidebar */}
        <button 
          onClick={toggleMenu}
          className="absolute top-4 right-4 text-xl md:hidden focus:outline-none"
        >
          <FaTimes />
        </button>
        
        <div className="p-5 flex flex-col h-full pt-12 md:pt-5">
          <h6 className="text-xl font-bold hidden md:block mb-6">MENU</h6>
          
          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    <a
                      href={item.href}
                      className="flex items-center p-3 rounded-md hover:bg-white hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="mr-3" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default SideBar;