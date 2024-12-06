import { FC } from 'react';

interface HeaderProps {
  mode: string;
}

const Header: FC<HeaderProps> = ({ }) => (
  <header>
    <h1 className="text-3xl font-bold text-primary" 
        style={{
          color: "var(--foreground)",
    }}>
      Welcome to Panda Express
    </h1>
    <p className="text-muted-foreground">Cashier Mode</p>
  </header>
);

export default Header;
