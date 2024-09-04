import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ to, children }) => {
  return (
    <Link to={to}>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
        {children}
      </button>
    </Link>
  );
};

export default Button;
