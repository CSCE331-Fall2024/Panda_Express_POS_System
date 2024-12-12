
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
 * import Document from 'path/to/Document';
 *
 * function MyApp() {
 *   return <Document />;
 * }
 * 
 * @returns {JSX.Element} The rendered component.
 */

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
