/**
 * This file is the main entry point for the application.
 * It sets up the user provider and theme provider for the application.
 * 
 * @remarks
 * This file is the main entry point for the application.
 * It sets up the user provider and theme provider for the application.
 * 
 * @example
 * // To use this component, simply import and include it in your Next.js page
 * import App from 'path/to/App';
 *
 * function MyApp() {
 *   return <App />;
 * }
 * 
 * @returns {JSX.Element} The rendered component.
 */
import "@/styles/globals.css";
import { UserProvider } from '@/components/ui/user_context';
import { ThemeProvider } from "@/components/context/theme_context";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </UserProvider>
  );
}
