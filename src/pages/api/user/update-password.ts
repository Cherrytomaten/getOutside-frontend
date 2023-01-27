import type { NextApiRequest, NextApiResponse } from 'next';
import { AUTH_TOKEN } from '@/types/constants';
import axios, { AxiosResponse } from 'axios';
import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';
import { logger } from '@/util/logger';

type ChangePasswordRequest = NextApiRequest & {
  body: {
    password: string;
    new_password: string;
    new_password2: string;
  };
};

/**
 * Change common user data like email, fname, lname & email.
 * @param _req expects a cookie header with the AUTH_TOKEN & body with ALWAYS the username, email, fname & lname.
 * username & email must be set and can't be an empty string.
 * @param res returns OK status or error message
 */
export default async function handler(
  _req: ChangePasswordRequest,
  res: NextApiResponse
) {
  // wrong request method
  if (_req.method !== 'PUT') {
    return res.status(405).json({
      errors: { message: 'Given request method is not allowed here.' },
    });
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
        `https://cherrytomaten.herokuapp.com/authentication/user/password/${authToken.userId}/`,
        {
          old_password: _req.body.password,
          password: _req.body.new_password,
          password2: _req.body.new_password2,
        },
        {
          headers: {
            Authorization: 'Bearer ' + authToken.token,
          },
        }
      )
      .then((_res: AxiosResponse) => {
        return res.status(_res.status).end();
      })
      .catch((err: BackendErrorResponse) => {
        logger.log('error response:', err.response);
        if (err.response?.data === undefined) {
          return res
            .status(err.response?.status ? err.response?.status : 500)
            .json({ errors: { message: 'A server error occured.' } });
        }
        return res
          .status(err.response.status)
          .json({ errors: { message: err.response.data.detail } });
      });
  } catch (_err) {
    return res
      .status(400)
      .json({ errors: { message: 'Could not update user password.' } });
  }
}
