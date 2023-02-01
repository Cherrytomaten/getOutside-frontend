import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';
import { AUTH_TOKEN } from '@/types/constants';
import { logger } from '@/util/logger';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";

type DeleteCommentRequest = NextApiRequest & {
  query: {
    commentId: string;
  }
}

type DeleteCommentResponse = NextApiResponse<void | FetchServerErrorResponse>;

/**
 * Delete a comment
 * @param _req contains the comment id in the request body
 * @param res void or an error response
 */
export default async function handler(_req: DeleteCommentRequest, res: DeleteCommentResponse) {
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
      .delete(`http://cherrytomaten.herokuapp.com/api/mappoint/detail/comments/${_req.query.commentId}`, {
        headers: {
          Authorization: 'Bearer ' + authToken.token,
        },
      })
      .then((_res: any) => {
        return res.status(_res.status).end();
      })
      .catch((err: BackendErrorResponse) => {
        logger.log('api delete comment error: ', err);
        if (err.response?.data?.detail === undefined) {
          return res.status(err.response?.status ? err.response?.status : 500).json({ errors: { message: 'A server error occured.' } });
        }
        return res.status(err.response.status).json({ errors: { message: err.response.data.detail } });
      });
  } catch (err) {
    logger.log('api Error deleting comment:', err);
    return res.status(500).json({ errors: { message: 'Internal error deleting comment.' } });
  }
}
