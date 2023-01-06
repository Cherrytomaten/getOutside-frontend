import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { AUTH_TOKEN } from '@/types/constants';
import { Logger } from '@/util/logger';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

type PicDataRequest = NextApiRequest & {
  body: {
    form_data: any;
  };
};

export default async function handler(
  _req: PicDataRequest,
  res: NextApiResponse
) {
  Logger.log('handler');

  // wrong request method
  if (_req.method !== 'PUT') {
    return res.status(405).json({
      errors: { message: 'Given request method is not allowed here.' },
    });
  }

  Logger.log('req: ', _req.body);

  if (_req.body === null) {
    return res
      .status(400)
      .json({ errors: { message: 'Given resource must not be null!' } });
  }

  try {
    const authTokenString = _req.cookies[AUTH_TOKEN];
    if (authTokenString === undefined || authTokenString === 'undefined') {
      return res
        .status(400)
        .json({ errors: { message: 'Wrong token format.' } });
    }

    const authToken: TokenPayload = JSON.parse(authTokenString);

    return await axios
      .put(
        `https://cherrytomaten.herokuapp.com/authentication/user/upload/${authToken.userId}`,
        {
          file: _req.body,
        },
        {
          headers: {
            'Authorization': 'Bearer ' + authToken.token,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      .then((_res: any) => {
        return res.status(_res.status);
      })
      .catch((err: any) => {
        console.log('Error: ', err);
        return res
          .status(err.response.status)
          .json({ error: { message: err } });
      });
  } catch (_err) {
    return res.status(400).json({
      error: { message: 'Uploading the profile picture went wrong.' },
    });
  }
}
