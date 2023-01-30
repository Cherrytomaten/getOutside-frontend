import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { BackendErrorProps } from '@/types/Backend/BackendErrorProps';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';
import { AUTH_TOKEN } from '@/types/constants';
import { logger } from '@/util/logger';
import axios, { AxiosResponse } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

type MapPointApiRequest = NextApiRequest & {
  query: {
    mapPointUuid: string;
  };
};

export default async function handler(_req: MapPointApiRequest, res: NextApiResponse) {
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
    if (authToken === null) {
      return res.status(401).json({ errors: { message: 'Please refresh or login again. No valid token credentials.' } });
    }

    return await axios
      .post(`http://cherrytomaten.herokuapp.com/api/mappoint/detail/comments`, {
        mappointPin: _req.body.mappointId,
        author: authToken.userId,
        text: _req.body.text,
      })
      .then((_res: any) => {
        return _res;
      })
      .catch((err: BackendErrorResponse) => {
        logger.log('add comment error: ', err);
        if (err.response?.data === undefined) {
          return res.status(err.response?.status ? err.response?.status : 500).json({ errors: { message: 'A server error occured.' } });
        }
        return res.status(err.response.status).json({ errors: { message: err.response.data } });
      });
  } catch (err) {
    logger.log('Error adding comment:', err);
    return res.status(400).json({ errors: { message: 'Error adding comment.' } });
  }
}
