'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import SignInButton from '../auth/SignInButton';
import { CodeBracketIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActivePath = (path) => {
    if (path === '/') return pathname === path;
    return pathname.startsWith(path);
  };

  const getLinkClassName = (path) => {
    return `relative px-3 py-2 transition-colors duration-200 ${
      isActivePath(path) 
        ? 'text-blue-600 dark:text-blue-400' 
        : 'hover:text-blue-600 dark:hover:text-blue-400'
    }`;
  };

  const ActiveIndicator = () => (
    <motion.div
      layoutId="activeIndicator"
      className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 dark:from-blue-400 dark:via-blue-300 dark:to-blue-400 rounded-full"
      initial={false}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1
      }}
      animate={{
        opacity: [0.6, 1, 0.6],
        scale: [0.98, 1, 0.98],
      }}
    />
  );

  return (
    <motion.header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm' : ''
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          <CodeBracketIcon className="h-6 w-6" />
          Template
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/about" 
            className={getLinkClassName('/about')}
          >
            About Us
            {isActivePath('/about') && <ActiveIndicator />}
          </Link>
          {session ? (
            <Link 
              href="/dashboard" 
              className={`btn-primary ${isActivePath('/dashboard') ? 'bg-blue-700 dark:bg-blue-600' : ''}`}
            >
              Dashboard
            </Link>
          ) : (
            <SignInButton />
          )}
        </div>
      </nav>
    </motion.header>
  );
}