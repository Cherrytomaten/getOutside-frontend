import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head'
import { AuthProvider } from "@/context/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <>
          <Head>
              <meta charSet="utf-8" />
              <meta name="description" content="The app for outside adventures!" />
              <meta name="keywords" content="Outside, sport, adventures" />
              <title>GetOutside</title>

              <link rel="manifest" href="/manifest.json" />
              <link rel="apple-touch-icon" href="/pwaIcons/maskable_icon_x512.png"></link>
              <meta name="theme-color" content="#3ED598" />
          </Head>
          <AuthProvider>
              <Component {...pageProps} />
          </AuthProvider>
      </>
  );
}

export default MyApp;
