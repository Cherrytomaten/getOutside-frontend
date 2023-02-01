import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';
import { AUTH_TOKEN } from '@/types/constants';
import { logger } from '@/util/logger';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";

type AddCommentRequest = NextApiRequest & {
  body: {
    mappointID: string;
    text: string;
  }
}

type AddCommentResponseBody = {
  author: string;
  created_at: string;
  mappointPin: string;
  text: string;
  uuid: string;
}

type AddCommentResponse = NextApiResponse<AddCommentResponseBody | FetchServerErrorResponse>;

/**
 * Add a comment to a mappoint
 * @param _req id of the mappoint where the comment should be added and the comment text.
 * @param res the data of the just created comment
 */
export default async function handler(_req: AddCommentRequest, res: AddCommentResponse) {
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
      .post(
        `http://cherrytomaten.herokuapp.com/api/mappoint/detail/comments`,
        {
          mappointID: _req.body.mappointId,
          text: _req.body.text,
        },
        {
          headers: {
            Authorization: 'Bearer ' + authToken.token,
          },
        }
      )
      .then((_res: any) => {
        logger.log('api res data:', _res.data);
        return res.status(_res.status).json(_res.data);
      })
      .catch((err: BackendErrorResponse) => {
        logger.log('api add comment error: ', err);
        if (err.response?.data?.detail === undefined) {
          return res.status(err.response?.status ? err.response?.status : 500).json({ errors: { message: 'A server error occured.' } });
        }
        return res.status(err.response.status).json({ errors: { message: err.response.data.detail } });
      });
  } catch (err) {
    logger.log('api Error adding comment:', err);
    return res.status(400).json({ errors: { message: 'Error adding comment.' } });
  }
}
