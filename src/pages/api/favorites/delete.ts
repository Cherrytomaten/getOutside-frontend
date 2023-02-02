import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { FetchServerErrorResponse } from '@/types/Server/FetchServerErrorResponse';
import { AUTH_TOKEN } from "@/types/constants";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";

type DeleteFavoriteRequest = NextApiRequest & {
  body: { pinId: string };
};

type DeleteFavoriteResponseBody = {
  res: string;
};

type DeleteFavoriteErrorResponse = {
  response: AxiosResponse<{ res: string }>;
};

type DeleteFavoriteResponse = NextApiResponse<DeleteFavoriteResponseBody | FetchServerErrorResponse>;

/**
 * Delete a mappoint from the current users favorite list
 * @param _req containing the pinId in the body
 * @param res returns a short success message or an error response
 */
export default async function handler(_req: DeleteFavoriteRequest, res: DeleteFavoriteResponse) {
  // wrong request method
  if (_req.method !== 'DELETE') {
    return res.status(405).json({ errors: { message: 'Given request method is not allowed here.' } });
  }

  try {
    const authTokenString = _req.cookies[AUTH_TOKEN];
    if (authTokenString === undefined || authTokenString === 'undefined') {
      return res.status(400).json({ errors: { message: 'Wrong token format.' } });
    }

    const authToken: TokenPayload = JSON.parse(authTokenString);

    return await axios
      .delete('https://cherrytomaten.herokuapp.com/api/favorites/pin/', {
        headers: {
          Authorization: 'Bearer ' + authToken.token,
        },
        data: { pin: _req.body.pinId }
      })
      .then((_res: AxiosResponse<DeleteFavoriteResponseBody>) => {
        return res.status(201).json(_res.data);
      })
      .catch((err: DeleteFavoriteErrorResponse) => {
        if (err.response?.data?.res === undefined) {
          return res.status(err.response.status).json({ errors: { message: 'A server error occured.' } });
        }
        return res.status(err.response.status).json({ errors: { message: err.response.data.res } });
      });
  } catch (_err) {
    return res.status(400).json({ errors: { message: 'Wrong token format.' } });
  }
}


/*
success:
  res: string

error:
  res: string
 */
