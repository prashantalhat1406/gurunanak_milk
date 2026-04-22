import React from 'react';

const Header = ({ name }) => {
  return (
    <header style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h1 style={{ margin: 0 }}>{name}</h1>
    </header>
  );
};

export default Header;
