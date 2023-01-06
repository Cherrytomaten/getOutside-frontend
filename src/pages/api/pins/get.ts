import { NextApiRequest, NextApiResponse } from "next";
import { LatLngTuple } from "leaflet";
import pins from '@/simulation/pins.json';
import getDistance from 'geolib/es/getDistance';
import { PinProps } from "@/types/Pins";
import axios from 'axios';
import { Logger } from '@/util/logger';

type PinsApiRequest = NextApiRequest & {
  query: {
    location: string;
    radius: number;
  };
};

type PinsPayload = MapPointProps & {
  category: any | null;
  creator_id: any | null;
  longitude: number;
  latitude: number;
  notes: string | null;
  created: string;
};

export default async function handler(
  _req: PinsApiRequest,
  res: NextApiResponse
) {
  // wrong request method
  if (_req.method !== 'GET') {
    return res.status(405).json({
      errors: { message: 'Given request method is not allowed here.' },
    });
  }

  try {
    return await axios
      .get('https://cherrytomaten.herokuapp.com/api/mappoint')
      .then((_res: any) => {
        Logger.log('Mappoints response data: ', _res.data);
        let pins: PinsPayload[] = _res.data;

        const pinsInRange: PinsPayload[] = pins.filter((pin) => {
          const pinPos: LatLngTuple = [pin.latitude, pin.longitude];
          const userPosString: string = _req.query.location;
          const userPosCoords: string[] = userPosString.split(',');
          const distance = getDistance(
            { latitude: userPosCoords[0], longitude: userPosCoords[1] },
            { latitude: pinPos[0], longitude: pinPos[1] }
          );
          return distance <= _req.query.radius;
        });

        return res.status(200).json(pinsInRange);
      });
  } catch (err) {
    console.log('Error fetching mappoints: ', err);
  }

  // const pinsInRange: PinProps[] = pins.mappoint.filter(
  //     (pin) => {
  //         const pinPos: LatLngTuple = [pin.geometry.coordinates[0], pin.geometry.coordinates[1]];
  //         const userPosString: string = _req.query.location;
  //         const userPosCoords: string[] = userPosString.split(',');
  //         const distance = getDistance({ latitude: userPosCoords[0], longitude: userPosCoords[1] },{ latitude: pinPos[0], longitude: pinPos[1] });
  //         return distance <= _req.query.radius;
  //     }
  // );

  // setTimeout(async () => {
  //     return res.status(200).json(pinsInRange);
  // }, 300);
}
