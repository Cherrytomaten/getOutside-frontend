import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MapPoint } from '@/components/MapPoint';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useAuth } from '@/context/AuthContext';
import { logger } from '@/util/logger';
import { GetServerSidePropsContext } from 'next';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';
import { PinProps } from '@/types/Pins';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const mappointId: string | string[] | undefined = context.params?.pid;

  try {
    if (mappointId === undefined) {
      throw new Error('MapPoint ID is undefined!');
    }

    return await axios
      // id s in url in frontend not match
      // .get(`https://cherrytomaten.herokuapp.com/api/mappoint/${mappointId}`)
      .get('https://cherrytomaten.herokuapp.com/api/mappoint/1')
      .then((_res: any) => {
        logger.log('Mappoint Backend Data:', _res.data);
        return {
          props: {
            uuid: _res.data.id,
            name: _res.data.title,
            desc: _res.data.description,
            address: _res.data.address,
            opening: _res.data.openingHours,
            rating: _res.data.ratings,
            comments: _res.data.comments,
            image: _res.data.image,
            category: _res.data.category,
            creator_id: _res.data.creator_id,
            longitude: _res.data.longitude,
            latitude: _res.data.latitude,
          },
        };
      })
      .catch((_err: BackendErrorResponse) => {
        throw new Error('Internal Server Error.');
      });
  } catch (err) {
    console.log('Error requesting mappoint page: ', err);
    return {
      notFound: true,
    };
  }
}

function MapPointPage({ ...mapointPayload }: PinProps) {
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
    <>
      <MapPoint
        id={mapointPayload.id}
        name={mapointPayload.name}
        desc={mapointPayload.desc}
        address={mapointPayload.address}
        opening={mapointPayload.opening}
        rating={mapointPayload.rating}
        comments={mapointPayload.comments}
        image={mapointPayload.image}
        category={mapointPayload.category}
        creator_id={mapointPayload.creator_id}
        longitude={mapointPayload.longitude}
        latitude={mapointPayload.latitude}
      />
    </>
  );
  // }
}

export default MapPointPage;
