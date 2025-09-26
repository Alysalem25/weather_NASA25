'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Map, 
  Menu, 
  X, 
  Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [showWidget, setShowWidget] = useState(false); // weather widget

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Weather Dashboard', href: '/app/dashboard', icon: Map },
{ name: 'Weather Dashboard', href: '/dashboard', icon: Map }
    // { name: 'Real Weather Demo', href: '/demo', icon: Cloud },
  ];

  return (
    <>
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white glow-text">
                NASA Weather
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors duration-200"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              ))}

              {/* Widget Toggle Button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowWidget(!showWidget)}
              >
                {showWidget ? "Close Widget" : "Open Widget"}
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-white/10"
              >
                <div className="py-4 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}

                  {/* Widget Toggle for Mobile */}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="ml-4"
                    onClick={() => {
                      setShowWidget(!showWidget);
                      setIsOpen(false);
                    }}
                  >
                    {showWidget ? "Close Widget" : "Open Widget"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Weather Widget */}
      <AnimatePresence>
        {showWidget && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 right-4 w-80  rounded-lg shadow-lg p-4 z-50"
            style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <h3 className="text-lg font-bold mb-2">Weather Widget</h3>
            <p>🌤 Current temperature: 25°C</p>
            <p>💨 Wind: 10 km/h</p>
            <p>🌡 Humidity: 60%</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
