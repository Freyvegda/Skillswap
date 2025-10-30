'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="backdrop-blur-md bg-cyan-50/70 border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SkillSwap</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#how-it-works"
              className="font-semibold text-gray-600 hover:text-gray-900 transition"
            >
              How it Works
            </Link>
            <Link
              href="#browse-skills"
              className="font-semibold text-gray-600 hover:text-gray-900 transition"
            >
              Browse Skills
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth"
              className="text-gray-700 hover:text-gray-900 font-medium transition"
            >
              Login
            </Link>
            <Link
              href="/auth"
              className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition font-medium"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            <Link
              href="#how-it-works"
              className="block text-gray-600 hover:text-gray-900 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link
              href="#browse-skills"
              className="block text-gray-600 hover:text-gray-900 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Skills
            </Link>
            <Link
              href="/auth"
              className="block text-gray-700 hover:text-gray-900 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/auth"
              className="block w-full bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition font-medium text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;