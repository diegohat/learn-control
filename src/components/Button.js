import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ to, children, bgColor = 'bg-blue-500', hoverColor = 'hover:bg-blue-700', textColor = 'text-white' }) => {
  return (
    <Link to={to}>
      <button className={`${bgColor} ${hoverColor} ${textColor} font-bold py-2 px-4 rounded m-2`}>
        {children}
      </button>
    </Link>
  );
};

export default Button;
