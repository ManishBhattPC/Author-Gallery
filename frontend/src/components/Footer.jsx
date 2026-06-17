import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-amber-50 border-t border-amber-100 py-8 sm:py-12 mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-base sm:text-lg font-semibold text-amber-900 mb-1 sm:mb-2">
              Authors Gallery
            </h3>
            <p className="text-amber-700 text-xs sm:text-sm text-center sm:text-left">
              Discover exceptional authors and their masterpieces
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h4 className="text-sm sm:text-base text-amber-900 font-semibold mb-2 sm:mb-3">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2 text-center">
              <li><a href="#explore" className="text-amber-700 hover:text-amber-600 text-xs sm:text-sm transition">Explore Authors</a></li>
              <li><a href="#books" className="text-amber-700 hover:text-amber-600 text-xs sm:text-sm transition">Featured Books</a></li>
              <li><a href="#about" className="text-amber-700 hover:text-amber-600 text-xs sm:text-sm transition">About Us</a></li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start lg:items-end">
            <h4 className="text-sm sm:text-base text-amber-900 font-semibold mb-2 sm:mb-3">Connect</h4>
            <ul className="space-y-1 sm:space-y-2 text-center sm:text-right">
              <li><a href="#" className="text-amber-700 hover:text-amber-600 text-xs sm:text-sm transition">Contact</a></li>
              <li><a href="#" className="text-amber-700 hover:text-amber-600 text-xs sm:text-sm transition">Support</a></li>
              <li><a href="#" className="text-amber-700 hover:text-amber-600 text-xs sm:text-sm transition">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-100 pt-4 sm:pt-6 flex flex-col items-center">
          <p className="text-amber-600 text-xs sm:text-sm font-medium mb-1">
            Where Stories Come Alive
          </p>
          <p className="text-amber-700 text-xs">
            © 2026 Authors Gallery. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer