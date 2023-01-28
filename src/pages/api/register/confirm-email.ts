import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { FetchServerErrorResponse } from '@/types/Server/FetchServerErrorResponse';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';

type ConfirmEmailRequest = NextApiRequest & {
  body: { email: string };
};

type ConfirmEmailResponseBody = {
  msg: string;
};

type ConfirmEmailResponse = NextApiResponse<ConfirmEmailResponseBody | FetchServerErrorResponse>;

/**
 * Send out an email to the just registered user.
 * @param _req containing the email in the body
 * @param res short message if the email was sent successfully or an error response
 */
export default async function handler(_req: ConfirmEmailRequest, res: ConfirmEmailResponse) {
  // wrong request method
  if (_req.method !== 'POST') {
    return res.status(405).json({ errors: { message: 'Given request method is not allowed here.' } });
  }

  return await axios
    .post('https://cherrytomaten.herokuapp.com/authentication/user/confirm-email/', {
      email: _req.body.email,
    })
    .then((_res: AxiosResponse<ConfirmEmailResponseBody>) => {
      return res.status(201).json(_res.data);
    })
    .catch((err: BackendErrorResponse) => {
      if (err.response?.data?.detail === undefined) {
        return res.status(err.response.status).json({ errors: { message: 'A server error occured.' } });
      }
      return res.status(err.response.status).json({ errors: { message: err.response.data.detail } });
    });
}
