import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { AUTH_TOKEN } from '@/types/constants';
import axios from 'axios';
import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';

type PicDataRequest = NextApiRequest & {
  body: {
    form_data: any;
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(_req: PicDataRequest, res: NextApiResponse) {
  // wrong request method
  if (_req.method !== 'PUT') {
    return res.status(405).json({
      errors: { message: 'Given request method is not allowed here.' },
    });
  }

  if (_req.body === null) {
    return res.status(400).json({ errors: { message: 'Given resource must not be null!' } });
  }

  try {
    const authTokenString = _req.cookies[AUTH_TOKEN];
    if (authTokenString === undefined || authTokenString === 'undefined') {
      return res.status(400).json({ errors: { message: 'Wrong token format.' } });
    }

    const authToken: TokenPayload = JSON.parse(authTokenString);

    // const form = new formidable.IncomingForm();
    // form.uploadDir = "./";
    // form.keepExtensions = true;
    // form.parse(_req, (err, fields, files) => {
    //   console.log(files);
    // });

    const data = await new Promise(function (resolve, reject) {
      const form = new formidable.IncomingForm({ keepExtensions: true });
      form.parse(_req, function (err, fields, files) {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    return await axios
      .put(
        `https://cherrytomaten.herokuapp.com/authentication/user/upload/${authToken.userId}`,
        {
          name: 'abd',
        },
        {
          headers: {
            Authorization: 'Bearer ' + authToken.token,
          },
          maxContentLength: 100000000,
          maxBodyLength: 1000000000,
        }
      )
      .then((_res: any) => {
        return res.status(_res.status);
      })
      .catch((err: any) => {
        console.log('Error: ', err);
        return res.status(err.response.status).json({ error: { message: err.message } });
      });
  } catch (_err) {
    return res.status(400).json({
      error: { message: 'Uploading the profile picture went wrong.' },
    });
  }
}
