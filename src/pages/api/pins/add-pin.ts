import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from "axios";
import { logger } from '@/util/logger';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';
import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { AUTH_TOKEN } from '@/types/constants';
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";
import { AddPinProps } from "@/types/Pins/AddPinProps";

type AddMappointRequest = NextApiRequest & {
  body: {pin: AddPinProps};
}

type addMappointResponse = NextApiResponse<{ uuid: string; } | FetchServerErrorResponse>;

/**
 * Add a mappoint
 * @param _req data necessary to create a mappoint
 * @param res uuid of the just created mappoint or an error response
 */
export default async function handler(_req: AddMappointRequest, res: addMappointResponse) {
  // wrong request method
  if (_req.method !== 'POST') {
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
      .post('https://cherrytomaten.herokuapp.com/api/mappoint', {
        title: _req.body.pin.title,
        address: _req.body.pin.address,
        category: _req.body.pin.category,
        description: _req.body.pin.desc,
        latitude: _req.body.pin.coords[0],
        longitude: _req.body.pin.coords[1],
        openingHours: _req.body.pin.openingHours,
        creator: authToken.userId
      }, {
        headers: {
          Authorization: 'Bearer ' + authToken.token,
        },
      })
      .then((_res: AxiosResponse<{ uuid: string; }>) => {
        return res.status(200).json(_res.data);
      })
      .catch((err: BackendErrorResponse) => {
        if (err.response?.data?.detail === undefined) {
          return res.status(err.response?.status ? err.response?.status : 500).json({ errors: { message: 'A server error occured.' } });
        }
        return res.status(err.response.status).json({ errors: { message: err.response.data.detail } });
      });
  } catch (_err) {
    logger.log('Error creating a new mappoint: ', _err);
    return res.status(400).json({ errors: { message: 'Error creating mappoint a new categories.' } });
  }
}
