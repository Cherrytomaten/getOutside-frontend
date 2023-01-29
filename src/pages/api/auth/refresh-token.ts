import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { UserAuthProps } from '@/types/User';
import { FetchServerErrorResponse } from '@/types/Server/FetchServerErrorResponse';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';
import { tokenDecompiler } from '@/util/tokenDecompiler';

type RefreshTokenRequest = NextApiRequest & {
  body: {
    refreshToken: TokenPayload;
  };
};

type RefreshTokenResponse = NextApiResponse<UserAuthProps | FetchServerErrorResponse>;

type RefreshTokenServerResponseData = {
  access: string;
  refresh: string;
};

type RefreshTokenServerResponse = AxiosResponse<RefreshTokenServerResponseData>;

/**
 * Get a new set of access & refresh token, based on the provided refresh token.
 * @param _req expects a body of following content { refreshToken: TokenPayload }
 * @param res on success returns a new set of access & refresh token.
 */
export default async function handler(_req: RefreshTokenRequest, res: RefreshTokenResponse) {
  // wrong request method
  if (_req.method !== 'POST') {
    return res.status(405).json({ errors: { message: 'Given request method is not allowed here.' } });
  }

  return await axios
    .post('https://cherrytomaten.herokuapp.com/authentication/token/refresh/', {
      refresh: _req.body.refreshToken.token,
    })
    .then((_res: RefreshTokenServerResponse) => {
      const accessToken = tokenDecompiler(_res.data.access);
      const refreshToken = tokenDecompiler(_res.data.refresh);

      if (accessToken === null || refreshToken === null) {
        return res.status(500).json({ errors: { message: 'A server error occured.' } });
      }
      return res.status(_res.status).json({
        userId: _req.body.refreshToken.userId,
        access: accessToken,
        refresh: refreshToken,
      });
    })
    .catch((err: BackendErrorResponse) => {
      if (err.response?.data?.detail === undefined) {
        return res.status(err.response?.status ? err.response?.status : 500).json({ errors: { message: 'A server error occured.' } });
      }
      return res.status(err.response.status).json({ errors: { message: err.response.data.detail } });
    });
}
