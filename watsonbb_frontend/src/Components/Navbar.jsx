import React, { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <header className="mx-full bg-transparent shadow-lg sticky top-0 z-50">
      <nav className="w-full">
        <div className="flex justify-between items-center bg-gray-900 text-white px-6 py-3 shadow-lg border border-indigo-700">

          {/* this is for logo section*/}
          <div className="flex items-center gap-3 cursor-pointer select-none">
            
            <h1 className="text-transparent bg-clip-text text-white font-extrabold text-2xl font-serif tracking-wide select-text">
              Watson Book Buddy
            </h1>
            <span className="h-3 w-3 bg-green-400 rounded-full animate-pulse" aria-label="online status" />
          </div>

          {/* Desktop menu section*/}
          <div className="hidden sm:flex items-center gap-4">

            {/* select language section */}
            <select
              id="lang"
              className="bg-white/30 backdrop-blur-sm text-white border border-purple-400 rounded-lg px-3 py-1.5 text-sm font-semibold cursor-pointer shadow-md hover:bg-white/50 transition duration-300"
              aria-label="Select language"
            >
              <option className="text-black">EN</option>
              <option className="text-black">HI</option>
              <option className="text-black">Urdu</option>
            </select>
          </div>

          {/* Hamburger - Mobile */}
          <button
            className="sm:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              // Close icon
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden mt-3 bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900 rounded-2xl px-6 py-4 shadow-lg border border-indigo-700">
            <select
              id="lang-mobile"
              className="bg-white/30 backdrop-blur-sm text-white border border-purple-400 rounded-full px-4 py-2 text-sm font-semibold cursor-pointer shadow-md hover:bg-white/50 transition duration-300 w-full mb-4"
              aria-label="Select language"
            >
              <option className="text-black">EN</option>
              <option className="text-black">HI</option>
              <option className="text-black">Urdu</option>
            </select>

          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
