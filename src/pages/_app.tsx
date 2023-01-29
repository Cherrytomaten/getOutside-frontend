import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { getCookie } from '@/util/cookieManager';
import { useRouter } from 'next/router';
import { AUTH_TOKEN } from '@/types/constants';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [showNavbar, setShowNavbar] = useState<boolean>(false);

  useEffect(() => {
    const cookie = getCookie(AUTH_TOKEN);
    // hide navbar if user not logged in or on mainpage
    if (cookie === null || router.pathname === '/') {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  }, [router]);

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
        {showNavbar && <Navbar />}
      </AuthProvider>
    </>
  );
}

export default MyApp;
