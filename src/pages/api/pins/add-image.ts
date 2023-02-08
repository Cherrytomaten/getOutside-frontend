import { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios";
import { logger } from '@/util/logger';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';
import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { AUTH_TOKEN } from '@/types/constants';

type AddImageRequest = NextApiRequest & {
  body: {
    pinId: string;
    imageUrl: string;
  };
}

/**
 * Add an image to an existing mappoint
 * @param _req id of the mappoint and url of the image
 * @param res void on success or an error response
 */
export default async function handler(_req: AddImageRequest, res: NextApiResponse) {
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
      .post('https://cherrytomaten.herokuapp.com/api/mappoint/upload/', {
        mappoint: _req.body.pinId,
        cloud_pic: _req.body.imageUrl
      }, {
        headers: {
          Authorization: 'Bearer ' + authToken.token,
        },
      })
      .then((_res: any) => {
        return res.status(201).end();
      })
      .catch((err: BackendErrorResponse) => {
        if (err.response?.data?.detail === undefined) {
          return res.status(err.response?.status ? err.response?.status : 500).json({ errors: { message: 'A server error occured.' } });
        }
        return res.status(err.response.status).json({ errors: { message: err.response.data.detail } });
      });
  } catch (_err) {
    logger.log('Error adding image to mappoint: ', _err);
    return res.status(400).json({ errors: { message: 'Error adding image to mappoint.' } });
  }
}
