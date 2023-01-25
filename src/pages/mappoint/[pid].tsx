import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MapPoint } from '@/components/MapPoint';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUserAuth } from "@/hooks/useUserAuth";
import { useAuth } from "@/context/AuthContext";
import { logger } from "@/util/logger";

const MapPointPage = () => {
  const router = useRouter();
  const { pid } = router.query;
  const [mapPointData, setMapPointData] = useState<MapPointProps>();
  const authenticationHook = useUserAuth();
  const { fetchUserAuthState } = useAuth();

  useEffect(() => {
    if (!router.isReady) return;
    apiRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  useEffect(() => {
    if (!authenticationHook.authStatus) {
      router.push('/login');
    }
  }, [authenticationHook.authStatus, router]);

  if (fetchUserAuthState.context.user === null) {
    return <LoadingSpinner />;
  }

  async function apiRequest() {
    const backendData = await axios.get('/api/mappoint/get', {
      params: {
        uuid: pid,
      },
    });
    logger.log('backendData: ', backendData.data);
    setMapPointData(backendData.data);
  }

  const emptyOpening: OpeningProps = {
    monday: '---',
    tuesday: '---',
    wednesday: '---',
    thursday: '---',
    friday: '---',
    saturday: '---',
    sunday: '---',
  };

  const img: ImageProps = {
    src: '',
    alt: 'Bild nicht gefunden',
    width: 450,
    height: 300,
  };

  if (mapPointData === undefined) {
    return (
      <>
        <LoadingSpinner />
      </>
    );
  } else if (mapPointData.uuid === undefined) {
    return (
      <>
        <MapPoint
          uuid="000"
          name="Empty"
          desc="Something went wrong. We could not find this MapPoint."
          address="..."
          opening={emptyOpening}
          rating={0}
          comments={[]}
          image={img}
        />
      </>
    );
  } else {
    return (
      <>
        <MapPoint
          uuid={mapPointData.uuid}
          name={mapPointData.name}
          desc={mapPointData.desc}
          address={mapPointData.address}
          opening={mapPointData.opening}
          rating={mapPointData.rating}
          comments={mapPointData.comments}
          image={mapPointData.image}
        />
      </>
    );
  }
};

export default MapPointPage;
