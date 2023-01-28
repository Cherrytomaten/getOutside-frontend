import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { FetchServerErrorResponse } from '@/types/Server/FetchServerErrorResponse';

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
 * @param res Ids of the involded user / pin to confirm the success or error response
 */
export default async function handler(_req: AddFavoriteRequest, res: AddFavoriteResponse) {
  // wrong request method
  if (_req.method !== 'POST') {
    return res.status(405).json({ errors: { message: 'Given request method is not allowed here.' } });
  }

  return await axios
    .post('https://cherrytomaten.herokuapp.com/api/favorites/pin/', {
      pin: _req.body.pinId,
    })
    .then((_res: AxiosResponse<AddFavoriteResponseBody>) => {
      return res.status(201).json(_res.data);
    })
    .catch((err: AddFavoriteErrorResponse) => {
      if (err.response?.data?.res === undefined) {
        return res.status(err.response.status).json({ errors: { message: 'A server error occured.' } });
      }
      return res.status(err.response.status).json({ errors: { message: err.response.data.res } });
    });
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
