import Map from '@/components/Map';
import { useRouter } from 'next/router';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useEffect, useState } from "react";
import { favRepoClass } from "@/repos/FavRepo";
import { FavoritePinsList } from "@/types/Pins/FavoritePinsList";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";
import { logger } from "@/util/logger";
import { getMapCookies } from "@/util/getMapCookies";

type MapCookiesPayload = {
  radius: number | undefined;
  activeCategories: string[] | undefined;
  onlyShowFavorites: boolean | undefined;
};

function Home() {
  const router = useRouter();
  const authenticationHook = useUserAuth();
  const { fetchUserAuthState } = useAuth();
  const [favoritePinsList, setFavoritePinsList] = useState<FavoritePinsList>([]);
  const [mapCookies, setMapCookies] = useState<MapCookiesPayload>({ radius: undefined, activeCategories: undefined, onlyShowFavorites: undefined });

  useEffect(() => {
    if (!authenticationHook.authStatus) {
      router.push('/login');
    }
  }, [authenticationHook.authStatus, router]);

  // refetch data on each page visit to be always have the latest data available
  useEffect(() => {
    // get favs
    favRepoClass.get()
      .then((res: FavoritePinsList) => {
        setFavoritePinsList(res);
      })
      .catch((err: FetchServerErrorResponse) => {
        logger.warn(err);
      })

    // get cookies
    const newMapCookies: MapCookiesPayload = getMapCookies();
    setMapCookies(newMapCookies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (fetchUserAuthState.context.user === null) {
    return <LoadingSpinner />;
  }

  return (
    <main className="fixed w-full h-[calc(100%-56px)] max-h-screen overflow-hidden lg:mt-14">
      <Map cookiedCategories={mapCookies.activeCategories} cookiedRadius={mapCookies.radius}
           favoritePinsList={favoritePinsList} cookiedShowOnlyFav={mapCookies.onlyShowFavorites} />
    </main>
  );
}

export default Home;
