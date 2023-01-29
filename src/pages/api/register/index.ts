import type { NextApiRequest, NextApiResponse } from 'next';
import { RegisterUserProps } from '@/types/User/RegisterUserProps';
import axios, { AxiosResponse } from 'axios';
import { FetchRegisterDataResponse } from '@/types/User/FetchRegisterDataResponse';
import { FetchServerErrorResponse } from '@/types/Server/FetchServerErrorResponse';

type RegisterRequest = NextApiRequest & {
  body: { user: RegisterUserProps };
};

type RegisterErrorResponseProps = {
  email?: string[];
  username?: string[];
  password?: string[];
  detail?: string;
};

type RegisterErrorResponse = {
  response: AxiosResponse<RegisterErrorResponseProps>;
};

type RegisterResponse = NextApiResponse<{ username: string; email: string } | FetchServerErrorResponse>;

/**
 * Register a user by adding an entry to the database. The user is not activated at this point.
 * @param _req containing user data in the body
 * @param res containing the username & email of the registered user or an error response
 */
export default async function handler(_req: RegisterRequest, res: RegisterResponse) {
  // wrong request method
  if (_req.method !== 'POST') {
    return res.status(405).json({ errors: { message: 'Given request method is not allowed here.' } });
  }

  return await axios
    .post('https://cherrytomaten.herokuapp.com/authentication/user/create/', {
      username: _req.body.user.username,
      password: _req.body.user.password,
      email: _req.body.user.email,
    })
    .then((_res: FetchRegisterDataResponse) => {
      return res.status(201).json(_res.data);
    })
    .catch((err: RegisterErrorResponse) => {
      // email error
      if (err.response?.data?.email && err.response?.data?.email.length > 0) {
        return res.status(err.response.status).json({ errors: { message: err.response.data.email[0] } });
      }

      // username error
      if (err.response?.data?.username && err.response?.data?.username.length > 0) {
        return res.status(err.response.status).json({ errors: { message: err.response.data.username[0] } });
      }

      // password error
      if (err.response?.data?.password && err.response?.data?.password.length > 0) {
        return res.status(err.response.status).json({ errors: { message: err.response.data.password[0] } });
      }

      if (err.response?.data?.detail === undefined) {
        return res.status(err.response.status).json({ errors: { message: 'A server error occured.' } });
      }
      return res.status(err.response.status).json({ errors: { message: err.response.data.detail } });
    });
}
