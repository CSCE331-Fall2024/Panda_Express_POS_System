import "@/styles/globals.css";
import { UserProvider } from '@/components/ui/user_context';
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
