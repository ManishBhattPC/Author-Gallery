import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[#1E1916] text-[#EFE9DF] border-t border-[#3A2F28] py-12 sm:py-16 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 mb-10 pb-10 border-b border-[#3A2F28]">
          <div className="flex flex-col items-center sm:items-start space-y-4">
            <Link to="/" className="text-xl sm:text-2xl font-serif font-bold text-amber-200 hover:text-amber-300 transition">
              Author Gallery
            </Link>
            <p className="text-stone-400 text-xs sm:text-sm text-center sm:text-left leading-relaxed max-w-xs">
              A premium digital gallery for exceptional authors to share their masterpieces, stories, and building their legacies.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <h4 className="text-sm sm:text-base text-amber-200 font-semibold uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-center text-xs sm:text-sm font-medium">
              <li>
                <Link to="/explore" className="text-stone-400 hover:text-amber-200 transition">
                  Explore Creative Worlds
                </Link>
              </li>
              <li>
                <Link to="/authors" className="text-stone-400 hover:text-amber-200 transition">
                  Discover Authors
                </Link>
              </li>
              <li>
                <Link to="/books" className="text-stone-400 hover:text-amber-200 transition">
                  Featured Books
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-stone-400 hover:text-amber-200 transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start lg:items-end space-y-4">
            <h4 className="text-sm sm:text-base text-amber-200 font-semibold uppercase tracking-wider">Connect & Support</h4>
            <ul className="space-y-2 text-center sm:text-right text-xs sm:text-sm font-medium">
              <li>
                <Link to="/contact" className="text-stone-400 hover:text-amber-200 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-stone-400 hover:text-amber-200 transition">
                  Support Helpdesk
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-stone-400 hover:text-amber-200 transition">
                  Privacy & Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center text-center space-y-3">
          <p className="text-amber-200 font-serif italic text-sm sm:text-base tracking-wide">
            "Where stories come alive and writers build their legacy."
          </p>
          <p className="text-stone-500 text-xs sm:text-sm">
            © 2026 Author Gallery. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer