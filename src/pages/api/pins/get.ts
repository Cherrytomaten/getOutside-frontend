import { NextApiRequest, NextApiResponse } from "next";
import { LatLngTuple } from "leaflet";
import pins from '@/simulation/pins.json';
import getDistance from 'geolib/es/getDistance';
import { PinProps } from "@/types/Pins";
type PinsApiRequest = NextApiRequest & {
    query: {
        location: string;
        radius: number;
    }
}

export default function handler(_req: PinsApiRequest, res: NextApiResponse) {
    // wrong request method
    if (_req.method !== 'GET') {
        return res.status(405).json({errors: { message: 'Given request method is not allowed here.' } });
    }

    const pinsInRange: PinProps[] = pins.mappoint.filter(
        (pin) => {
            const pinPos: LatLngTuple = [pin.geometry.coordinates[0], pin.geometry.coordinates[1]];
            const userPosString: string = _req.query.location;
            const userPosCoords: string[] = userPosString.split(',');
            const distance = getDistance({ latitude: userPosCoords[0], longitude: userPosCoords[1] },{ latitude: pinPos[0], longitude: pinPos[1] });
            return distance <= _req.query.radius;
        }
    );

    setTimeout(async () => {
        return res.status(200).json(pinsInRange);
    }, 2000);
}
