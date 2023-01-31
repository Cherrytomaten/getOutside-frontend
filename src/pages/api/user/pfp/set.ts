import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { AUTH_TOKEN } from '@/types/constants';
import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from "next-http-proxy-middleware";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
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
    console.log(_req);

    await httpProxyMiddleware(_req, res, {
      target: `https://cherrytomaten.herokuapp.com`,
      changeOrigin: true,
      pathRewrite: {
        '^/api/user/pfp/set': `/authentication/user/upload/${authToken.userId}/`,
      },
      headers: {
        'Authorization': `Bearer ${authToken.token}`,
        ...(_req.headers['content-type'] ? {'content-type': _req.headers["content-type"]} : {}),
        ...(_req.headers['content-length'] ? {'content-length': _req.headers["content-length"]} : {}),
        ...(_req.headers['accept'] ? {'accept': _req.headers["accept"]} : {}),
      }
    });
  } catch (_err) {
    return res.status(400).json({
      error: { message: 'Uploading the profile picture went wrong.' },
    });
  }
}

/*


    const buffers: any[] = [];
    _req.on('readable', () => {
      const chunk = _req.read();
      if (chunk !== null) {
        buffers.push(chunk);
      }
    })
      .on('end', async () => {
        return await axios
          .put(
            `https://cherrytomaten.herokuapp.com/authentication/user/upload/${authToken.userId}`,
              Buffer.concat(buffers),
            {
              headers: {
                Authorization: 'Bearer ' + authToken.token,
                'Content-Type': 'multipart/form-data'
              },
              maxContentLength: 100000000,
              maxBodyLength: 1000000000,
            }
          )
          .then((_res: any) => {
            return res.status(_res.status);
          })
          .catch((err: any) => {
            console.log(err);
            return res.status(err.response.status).json({ error: { message: err.message } });
          });


        console.log("Buffer", Buffer.concat(buffers));
        return fetch(`https://cherrytomaten.herokuapp.com/authentication/user/upload/${authToken.userId}`, {
          method: 'PUT',
          credentials: 'include',
          mode: 'cors',
          headers: {
            'Authorization': 'Bearer ' + authToken.token,
            'User-Agent': _req.headers['user-agent'] ?? '',
          },
          body: "test",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Success:', data);
            return res.status(data.status);
          })
          .catch((err) => {
            console.error('Error:', err);
            return res.status(500).json({ error: { message: err } });
          });
      });

      /*
    const data: any = await new Promise(function (resolve, reject) {
      const form = new formidable.IncomingForm({ keepExtensions: true });
      form.parse(_req, function (err, fields, files) {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

       */

/*
return await axios
  .post(
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
    console.log(err);
    return res.status(err.response.status).json({ error: { message: err.message } });
  });
*/
