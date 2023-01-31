import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { FetchServerErrorResponse } from '@/types/Server/FetchServerErrorResponse';
import { AUTH_TOKEN } from "@/types/constants";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";
import { FavoritePinsList } from "@/types/Pins/FavoritePinsList";

type GetFavoriteErrorResponse = {
  response: AxiosResponse<{ res: string }>;
};

type GetFavoriteResponse = NextApiResponse<FavoritePinsList | FetchServerErrorResponse>;

/**
 * Get all favorite mappoints from a user
 * @param _req containing an access token in the header
 * @param res List of all favorites or an error response
 */
export default async function handler(_req: NextApiRequest, res: GetFavoriteResponse) {
  // wrong request method
  if (_req.method !== 'GET') {
    return res.status(405).json({ errors: { message: 'Given request method is not allowed here.' } });
  }

  try {
    const authTokenString = _req.cookies[AUTH_TOKEN];
    if (authTokenString === undefined || authTokenString === 'undefined') {
      return res.status(400).json({ errors: { message: 'Wrong token format.' } });
    }

    const authToken: TokenPayload = JSON.parse(authTokenString);

    return await axios
      .get("https://cherrytomaten.herokuapp.com/api/favorites/pin/", {
        headers: {
          Authorization: "Bearer " + authToken.token,
        },
      })
      .then((_res: AxiosResponse<FavoritePinsList>) => {
        return res.status(201).json(_res.data);
      })
      .catch((err: GetFavoriteErrorResponse) => {
        if (err.response?.data?.res === undefined) {
          return res.status(err.response.status).json({ errors: { message: 'A server error occured.' } });
        }
        return res.status(err.response.status).json({ errors: { message: err.response.data.res } });
      });
  } catch (_err) {
    return res.status(400).json({ errors: { message: 'Wrong token format.' } });
  }
}
