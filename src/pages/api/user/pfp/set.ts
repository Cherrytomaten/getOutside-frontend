import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { AUTH_TOKEN } from '@/types/constants';
import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from "axios";

type UploadPfpRequest = NextApiRequest & {
  body: { url: string };
};

type UploadPfpResponseBody = {
  url: string;
}

type UploadPfpErrorResponseProps = {
  error: string;
};

type UploadPfpErrorResponse = {
  response: AxiosResponse<UploadPfpErrorResponseProps>;
};

/**
 * Set a profile image
 * @param _req contains the url of the picture
 * @param res the url as confirmation of the now saved profile picture or an error response
 */
export default async function handler(_req: UploadPfpRequest, res: NextApiResponse) {
  // wrong request method
  if (_req.method !== 'PUT') {
    return res.status(405).json({
      errors: { message: 'Given request method is not allowed here.' },
    });
  }

  try {
    const authTokenString = _req.cookies[AUTH_TOKEN];
    if (authTokenString === undefined || authTokenString === 'undefined') {
      return res.status(400).json({ errors: { message: 'Wrong token format.' } });
    }

    const authToken: TokenPayload = JSON.parse(authTokenString);

    return await axios
      .put(`https://cherrytomaten.herokuapp.com/authentication/user/upload/${authToken.userId}/`, {
        cloud_pic: _req.body.url
      }, {
        headers: {
          Authorization: 'Bearer ' + authToken.token,
        }
      })
      .then((_res: AxiosResponse<UploadPfpResponseBody>) => {
        return res.status(201).json(_res.data);
      })
      .catch((err: UploadPfpErrorResponse) => {
        if (err.response?.data?.error === undefined) {
          return res.status(err.response.status).json({ errors: { message: 'A server error occured.' } });
        }
        return res.status(err.response.status).json({ errors: { message: err.response.data.error } });
      });

  } catch (_err) {
    return res.status(400).json({
      error: { message: 'Uploading the profile picture went wrong.' },
    });
  }
}
