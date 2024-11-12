import React from 'react';

interface HeaderProps {
  mode: string;
}

const Header: React.FC<HeaderProps> = ({ mode }) => (
  <header>
    <h1 className="text-3xl font-bold text-primary">Welcome to Panda Express</h1>
    <p className="text-muted-foreground">We Wok For You</p>
    <h2 className="text-2xl font-semibold text-black mt-4">{mode} Mode</h2>
  </header>
);

export default Header;
