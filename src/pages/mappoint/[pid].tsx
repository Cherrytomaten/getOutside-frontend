import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MapPoint } from '@/components/MapPoint';
import axios, { AxiosResponse } from "axios";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useAuth } from '@/context/AuthContext';
import { logger } from '@/util/logger';
import { GetServerSidePropsContext } from 'next';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';
import { AUTH_TOKEN } from '@/types/constants';
import { TokenPayload } from '@/types/Auth/TokenPayloadProps';

type MapPointPayloadProps = MapPointProps & {
  category: any | null;
  creator: string;
  longitude: number;
  latitude: number;
  userId: string;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const mappointId: string | string[] | undefined = context.params?.pid;
  const tokenData: string | undefined = context.req.cookies[AUTH_TOKEN];

  try {
    if (mappointId === undefined) {
      throw new Error('MapPoint ID is undefined!');
    }

    if (tokenData === undefined || tokenData === 'undefined') {
      throw new Error('TokenData is undefined!');
    }

    const authToken: TokenPayload = JSON.parse(tokenData);

    return await axios
      .get(`https://cherrytomaten.herokuapp.com/api/mappoint/${mappointId}`, {
        headers: {
          Authorization: 'Bearer ' + authToken.token,
        },
      })
      .then((_res: AxiosResponse<MapPointPayloadProps>) => {
        logger.log('Mappoint Backend Data:', _res.data);
        return {
          props: {
            uuid: _res.data.uuid,
            title: _res.data.title,
            description: _res.data.description,
            address: _res.data.address,
            openingHours: _res.data.openingHours,
            ratings: _res.data.ratings,
            comments: _res.data.comments,
            image: _res.data.image,
            category: _res.data.category,
            creator: _res.data.creator,
            longitude: _res.data.longitude,
            latitude: _res.data.latitude,
            userId: authToken.userId,
          },
        };
      })
      .catch((_err: BackendErrorResponse) => {
        throw new Error('Internal Server Error.');
      });
  } catch (err) {
    logger.log('Error requesting mappoint page: ', err);
    return {
      notFound: true,
    };
  }
}

function MapPointPage({ ...mapPointPayload }: MapPointPayloadProps) {
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
        uuid={mapPointPayload.uuid}
        title={mapPointPayload.title}
        description={mapPointPayload.description}
        address={mapPointPayload.address}
        openingHours={mapPointPayload.openingHours}
        ratings={mapPointPayload.ratings}
        comments={mapPointPayload.comments}
        image={mapPointPayload.image}
        category={mapPointPayload.category}
        creator={mapPointPayload.creator}
        longitude={mapPointPayload.longitude}
        latitude={mapPointPayload.latitude}
        userId={mapPointPayload.userId}
      />
    </>
  );
  // }
}

export default MapPointPage;
