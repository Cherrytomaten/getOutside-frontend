import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { FetchServerErrorResponse } from '@/types/Server/FetchServerErrorResponse';
import { AUTH_TOKEN } from "@/types/constants";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";

type AddFavoriteRequest = NextApiRequest & {
  body: { pinId: string };
};

type AddFavoriteResponseBody = {
  uuid: string;
  pin: string;
  user: string;
};

type AddFavoriteErrorResponse = {
  response: AxiosResponse<{ res: string }>;
};

type AddFavoriteResponse = NextApiResponse<AddFavoriteResponseBody | FetchServerErrorResponse>;

/**
 * Add a mappoint to the current users favorite list
 * @param _req containing the pinId in the body
 * @param res returns ids of the involded user / pin to confirm the success and the uuid of the database entry for the favorite pin entry or an error response.
 */
export default async function handler(_req: AddFavoriteRequest, res: AddFavoriteResponse) {
  // wrong request method
  if (_req.method !== 'POST') {
    return res.status(405).json({ errors: { message: 'Given request method is not allowed here.' } });
  }

  try {
    const authTokenString = _req.cookies[AUTH_TOKEN];
    if (authTokenString === undefined || authTokenString === 'undefined') {
      return res.status(400).json({ errors: { message: 'Wrong token format.' } });
    }

    const authToken: TokenPayload = JSON.parse(authTokenString);

    return await axios
      .post('https://cherrytomaten.herokuapp.com/api/favorites/pin/', {
        pin: _req.body.pinId,
      }, {
        headers: {
          Authorization: 'Bearer ' + authToken.token,
        },
      })
      .then((_res: AxiosResponse<AddFavoriteResponseBody>) => {
        console.log(_res.data)
        return res.status(201).json(_res.data);
      })
      .catch((err: AddFavoriteErrorResponse) => {
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
err:
   server crash
err duplicate:
    res: string
success:
  "uuid": "055b232c-70c0-45e0-88f1-286b01dfc4fc",
  "pin": "16170359-5830-412a-b0ec-dc7d2831723f",
  "user": "0e5ed6b9-d5b7-47f0-a4fa-202973061946"
 */
