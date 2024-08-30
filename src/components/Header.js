import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="text-center my-8">
      <h1 className="text-4xl font-bold text-blue-600">{title}</h1>
    </header>
  );
};

export default Header;
