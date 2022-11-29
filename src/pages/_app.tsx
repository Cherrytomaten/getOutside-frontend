import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head'
import { AuthProvider } from "@/context/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <>
          <Head>
              <meta charSet="utf-8" />
              <meta name="description" content="Description" />
              <meta name="keywords" content="Keywords" />
              <title>GetOutside</title>

              <link rel="manifest" href="/manifest.json" />
              <link rel="apple-touch-icon" href="/apple-icon.png"></link>
              <meta name="theme-color" content="#3ED598" />
          </Head>
          <AuthProvider>
              <Component {...pageProps} />
          </AuthProvider>
      </>
  );
}

export default MyApp;
