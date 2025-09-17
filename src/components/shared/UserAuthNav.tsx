// import  { useState } from 'react';
// import { Search, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function UserAuthNav() {
  // const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center mr-2">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-semibold text-gray-900">NlightN</span>
        </div>

        {/* Search Bar */}
        {/* <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Want to learn?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div> */}

        {/* Navigation Links and Buttons */}
        <div className="flex items-center space-x-6">
          {/* Explore Dropdown */}
          {/* <div className="relative">
            <button className="flex items-center text-green-600 hover:text-green-700 font-medium">
              Explore
              <ChevronDown className="ml-1 w-4 h-4" />
            </button>
          </div> */}

          {/* Navigation Links */}
          {/* <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            Home
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            About us
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            Contact us
          </a> */}

          {/* Create Account Button */}
          <Link
            to="/signin"
            className="text-green-600 border border-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Sign in
          </Link>

          {/* Create Account Button */}
          <Link
            to="/signup"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Create free account
          </Link>
        </div>
      </div>
    </nav>
  );
}