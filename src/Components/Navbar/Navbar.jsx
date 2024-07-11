import React from 'react';
import './Navbar.css';

const Navbar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="navbar">
      <input 
        type="text" 
        className="search-input" 
        placeholder='Search by name, email or role' 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

export default Navbar;
