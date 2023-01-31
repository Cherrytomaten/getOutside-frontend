import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';
import { AUTH_TOKEN } from '@/types/constants';
import { logger } from '@/util/logger';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  // wrong request method
  if (_req.method !== 'DELETE') {
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
      .delete(`http://cherrytomaten.herokuapp.com/api/mappoint/detail/comments/${_req.body.commentId}`, {
        headers: {
          Authorization: 'Bearer ' + authToken.token,
        },
      })
      .then((_res: any) => {
        return res.status(_res.status).end();
      })
      .catch((err: BackendErrorResponse) => {
        logger.log('api delete comment error: ', err);
        if (err.response?.data === undefined) {
          return res.status(err.response?.status ? err.response?.status : 500).json({ errors: { message: 'A server error occured.' } });
        }
        return res.status(err.response.status).json({ errors: { message: err.response.data } });
      });
  } catch (err) {
    logger.log('api Error deleting comment:', err);
    return res.status(500).json({ errors: { message: 'Internal error deleting comment.' } });
  }
}
