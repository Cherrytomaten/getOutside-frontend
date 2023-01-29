import Map from '@/components/Map';
import { useRouter } from 'next/router';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useEffect } from 'react';
import { ACTIVE_CATEGORIES, RADIUS_FILTER, DEFAULT_RADIUS } from '@/types/constants';
import { GetServerSidePropsContext } from 'next';

type MapCookiesPayload = {
  radius: number;
  activeCategories: string[];
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let _radius: number | undefined = undefined;
  let _activeCategories: string[] | undefined = undefined;

  try {
    if (context.req.cookies[RADIUS_FILTER]) {
      _radius = JSON.parse(context.req.cookies[RADIUS_FILTER]).radius;
    }
  } catch (_err) {
    console.error('An error occured while getting the radius cookie.');
  }

  try {
    if (context.req.cookies[ACTIVE_CATEGORIES]) {
      _activeCategories = JSON.parse(context.req.cookies[ACTIVE_CATEGORIES]).activeCats.split(',');
    }
  } catch (_err) {
    console.error('An error occured while getting the active categories cookie.');
  }

  return {
    props: {
      radius: _radius ? _radius : DEFAULT_RADIUS,
      activeCategories: _activeCategories ? _activeCategories : [],
    },
  };
}

function Home({ ...cookiePayload }: MapCookiesPayload) {
  const router = useRouter();
  const authenticationHook = useUserAuth();
  const { fetchUserAuthState } = useAuth();

  useEffect(() => {
    if (!authenticationHook.authStatus) {
      router.push('/login');
    }
  }, [authenticationHook.authStatus, router]);

  if (fetchUserAuthState.context.user === null) {
    return <LoadingSpinner />;
  }

  return (
    <main className="w-full h-[calc(100vh-56px)] max-h-screen overflow-hidden">
      <Map cookiedCategories={cookiePayload.activeCategories} cookiedRadius={cookiePayload.radius} />
    </main>
  );
}

export default Home;
