import Map from '@/components/Map';
import { useRouter } from 'next/router';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useEffect, useState } from "react";
import { ACTIVE_CATEGORIES, RADIUS_FILTER, DEFAULT_RADIUS, SHOW_ONLY_FAV } from "@/types/constants";
import { GetServerSidePropsContext } from 'next';
import { favRepoClass } from "@/repos/FavRepo";
import { FavoritePinsList } from "@/types/Pins/FavoritePinsList";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";
import { logger } from "@/util/logger";

type MapCookiesPayload = {
  radius: number;
  activeCategories: string[];
  onlyShowFavorites: boolean;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let _radius: number | undefined = undefined;
  let _activeCategories: string[] | undefined = undefined;
  let _showOnlyFav: boolean | undefined = undefined;

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

  try {
    if (context.req.cookies[SHOW_ONLY_FAV]) {
      _showOnlyFav = JSON.parse(context.req.cookies[SHOW_ONLY_FAV]);
    }
  } catch (_err) {
    console.error('An error occured while getting the radius cookie.');
  }

  return {
    props: {
      radius: _radius ? _radius : DEFAULT_RADIUS,
      activeCategories: _activeCategories ? _activeCategories : [],
      onlyShowFavorites: _showOnlyFav ?? false,
    },
  };
}

function Home({ ...cookiePayload }: MapCookiesPayload) {
  const router = useRouter();
  const authenticationHook = useUserAuth();
  const { fetchUserAuthState } = useAuth();
  const [favoritePinsList, setFavoritePinsList] = useState<FavoritePinsList>([]);

  useEffect(() => {
    if (!authenticationHook.authStatus) {
      router.push('/login');
    }
  }, [authenticationHook.authStatus, router]);

  // refetch data on each page visit to be always have the latest data available
  useEffect(() => {
    favRepoClass.get()
      .then((res: FavoritePinsList) => {
        setFavoritePinsList(res);
      })
      .catch((err: FetchServerErrorResponse) => {
        logger.warn(err);
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (fetchUserAuthState.context.user === null) {
    return <LoadingSpinner />;
  }

  return (
    <main className="fixed w-full h-[calc(100%-56px)] max-h-screen overflow-hidden lg:mt-14">
      <Map cookiedCategories={cookiePayload.activeCategories} cookiedRadius={cookiePayload.radius}
           favoritePinsList={favoritePinsList} cookiedShowOnlyFav={cookiePayload.onlyShowFavorites} />
    </main>
  );
}

export default Home;
