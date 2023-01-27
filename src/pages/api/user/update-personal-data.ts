import type { NextApiRequest, NextApiResponse } from 'next';
import { AUTH_TOKEN } from '@/types/constants';
import axios, { AxiosResponse } from 'axios';
import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';
import { Logger } from '@/util/logger';

type UserDataChangeServerResponseProps = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
};

type UserDataChangeServerResponse =
  AxiosResponse<UserDataChangeServerResponseProps>;

type ChangeDataRequest = NextApiRequest & {
  body: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
  };
};

/**
 * Change common user data like email, fname, lname & email.
 * @param _req expects a cookie header with the AUTH_TOKEN & body with ALWAYS the username, email, fname & lname.
 * username & email must be set and can't be an empty string.
 * @param res returns OK status or error message
 */
export default async function handler(
  _req: ChangeDataRequest,
  res: NextApiResponse
) {
  // wrong request method
  if (_req.method !== 'PUT') {
    return res.status(405).json({
      errors: { message: 'Given request method is not allowed here.' },
    });
  }

  try {
    const authTokenString: string | undefined = _req.cookies[AUTH_TOKEN];
    if (authTokenString === undefined || authTokenString === 'undefined') {
      return res.status(400).json({
        errors: { message: 'Wrong token format. Token is undefined.' },
      });
    }

    const authToken: TokenPayload = JSON.parse(authTokenString);

    if (authToken === null) {
      return res
        .status(500)
        .json({ errors: { message: 'Server Error. Token cannot be null!' } });
    }

    return await axios
      .put(
        `https://cherrytomaten.herokuapp.com/authentication/user/data/${authToken.userId}/`,
        {
          first_name: _req.body.first_name,
          last_name: _req.body.last_name,
          username: _req.body.username,
          email: _req.body.email,
        },
        {
          headers: {
            Authorization: 'Bearer ' + authToken.token,
          },
        }
      )
      .then((_res: UserDataChangeServerResponse) => {
        return res.status(_res.status).json({
          username: _res.data.username,
          first_name: _res.data.first_name,
          last_name: _res.data.last_name,
          email: _res.data.email,
        });
      })
      .catch((err: BackendErrorResponse) => {
        Logger.log('error response:', err.response);
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
      .json({ errors: { message: 'Could not update user data.' } });
  }
}
