import type { NextApiRequest, NextApiResponse } from 'next';
import { AUTH_REFRESH_TOKEN, AUTH_TOKEN } from '@/types/constants';
import axios, { AxiosResponse } from 'axios';
import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';
import { FetchServerErrorResponse } from '@/types/Server/FetchServerErrorResponse';
import { UserAuthProps } from '@/types/User';

type AuthByTokenResponse = NextApiResponse<UserAuthProps | FetchServerErrorResponse>;

type UserDataServerResponseProps = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string | null;
};

type UserDataServerResponse = AxiosResponse<UserDataServerResponseProps>;

/**
 * Confirms user authentication by cookied token.
 * @param _req expects a cookie header with the AUTH_TOKEN & AUTH_REFRESH_TOKEN as string.
 * @param res returns values typed as UserAuthProps { userId, access: TokenPayload, refresh: TokenPayload }
 */
export default async function handler(_req: NextApiRequest, res: AuthByTokenResponse) {
  // wrong request method
  if (_req.method !== 'GET') {
    return res.status(405).json({ errors: { message: 'Given request method is not allowed here.' } });
  }

  try {
    const authTokenString = _req.cookies[AUTH_TOKEN];
    if (authTokenString === undefined || authTokenString === 'undefined') {
      return res.status(400).json({ errors: { message: 'Wrong token format.' } });
    }

    const refTokenString = _req.cookies[AUTH_REFRESH_TOKEN];
    if (refTokenString === undefined) {
      return res.status(400).json({ errors: { message: 'Wrong refresh token format.' } });
    }

    const authToken: TokenPayload = JSON.parse(authTokenString);
    const refAuthToken: TokenPayload = JSON.parse(refTokenString);

    // just for confirmation purpose and not actual data query
    return await axios
      .get('https://cherrytomaten.herokuapp.com/authentication/user/', {
        headers: {
          Authorization: 'Bearer ' + authToken.token,
        },
      })
      .then((_res: UserDataServerResponse) => {
        return res.status(_res.status).json({
          userId: authToken.userId,
          access: authToken,
          refresh: refAuthToken,
        });
      })
      .catch((err: BackendErrorResponse) => {
        if (err.response?.data?.detail === undefined) {
          return res.status(err.response?.status ? err.response?.status : 500).json({ errors: { message: 'A server error occured.' } });
        }
        return res.status(err.response.status).json({ errors: { message: err.response.data.detail } });
      });
  } catch (_err) {
    return res.status(400).json({ errors: { message: 'Wrong token format.' } });
  }
}
