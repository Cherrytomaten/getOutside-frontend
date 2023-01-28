import { NextApiRequest, NextApiResponse } from 'next';
import { LatLngTuple } from 'leaflet';
import getDistance from 'geolib/es/getDistance';
import { PinProps } from '@/types/Pins';
import axios from 'axios';
import { logger } from '@/util/logger';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';
import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { AUTH_TOKEN } from '@/types/constants';

type PinsApiRequest = NextApiRequest & {
  query: {
    location: string;
    radius: number;
  };
};

export default async function handler(_req: PinsApiRequest, res: NextApiResponse) {
  // wrong request method
  if (_req.method !== 'GET') {
    return res.status(405).json({
      errors: { message: 'Given request method is not allowed here.' },
    });
  }

  try {
    const authTokenString = _req.cookies[AUTH_TOKEN];
    if (authTokenString === undefined || authTokenString === 'undefined') {
      return res.status(400).json({ errors: { message: 'Wrong token format.' } });
    }

    const authToken: TokenPayload = JSON.parse(authTokenString);

    return await axios
      .get('https://cherrytomaten.herokuapp.com/api/mappoint', {
        headers: {
          Authorization: 'Bearer ' + authToken.token,
        },
      })
      .then((_res: any) => {
        logger.log('Mappoints response data: ', _res.data);
        let pins: PinProps[] = _res.data;

        const pinsInRange: PinProps[] = pins.filter((pin) => {
          const pinPos: LatLngTuple = [pin.latitude, pin.longitude];
          const userPosString: string = _req.query.location;
          const userPosCoords: string[] = userPosString.split(',');
          const distance = getDistance({ latitude: userPosCoords[0], longitude: userPosCoords[1] }, { latitude: pinPos[0], longitude: pinPos[1] });
          return distance <= _req.query.radius;
        });

        return res.status(200).json(pinsInRange);
      })
      .catch((err: BackendErrorResponse) => {
        if (err.response?.data?.detail === undefined) {
          return res.status(err.response?.status ? err.response?.status : 500).json({ errors: { message: 'A server error occured.' } });
        }
        return res.status(err.response.status).json({ errors: { message: err.response.data.detail } });
      });
  } catch (_err) {
    logger.log('Error fetching mappoints: ', _err);
    return res.status(400).json({ errors: { message: 'Error fetching mappoints.' } });
  }
}
