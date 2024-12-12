/**
 * Represents a header component.
 * 
 * @remarks
 * This component provides a header with a title and a subtitle.
 * 
 * @returns {JSX.Element} The rendered header component.
 */
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
