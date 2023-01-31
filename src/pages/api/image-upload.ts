import { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";
import { CloudImageProps } from "@/types/CloudImage";

type UploadPictureResponse = NextApiResponse<CloudImageProps | FetchServerErrorResponse>;

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Route to upload images and get the image url
 * @param _req the image as formData object
 * @param res the created image object on the server
 */
export default async function handler(_req: NextApiRequest, res: UploadPictureResponse) {
  // wrong request method
  if (_req.method !== "POST") {
    return res.status(405).json({
      errors: { message: "Given request method is not allowed here." },
    });
  }

  await httpProxyMiddleware(_req, res, {
    target: `https://api.cloudinary.com`,
    changeOrigin: true,
    pathRewrite: [{
      patternStr: '^/api/image-upload',
      replaceStr: '/v1_1/htpaknavi/image/upload',
    }],
    headers: {
      ...(_req.headers["content-type"] ? { "content-type": _req.headers["content-type"] } : {}),
      ...(_req.headers["content-length"] ? { "content-length": _req.headers["content-length"] } : {}),
      ...(_req.headers["accept"] ? { "accept": _req.headers["accept"] } : {}),
    },
  });
}

/*
access_mode: "public"
​​
asset_id: "c2847c44d69e68c1bd99c1a21ecd9aa7"
​​
bytes: 858537
​​
created_at: "2023-01-31T19:46:11Z"
​​
etag: "c94e1bc9646c0b77e66970b585c2168b"
​​
folder: "get_outside/profile_picture"
​​
format: "jpg"
​​
height: 2160
​​
original_filename: "blob"
​​
placeholder: false
​​
public_id: "get_outside/profile_picture/nj9bryeqqeuk7midgzwk"
​​
resource_type: "image"
​​
secure_url: "https://res.cloudinary.com/htpaknavi/image/upload/v1675194371/get_outside/profile_picture/nj9bryeqqeuk7midgzwk.jpg"
​​
signature: "5f67e5f5d8013ec512c93b62256d722ea0c720d7"
​​
tags: Array []
​​
type: "upload"
​​
url: "http://res.cloudinary.com/htpaknavi/image/upload/v1675194371/get_outside/profile_picture/nj9bryeqqeuk7midgzwk.jpg"
​​
version: 1675194371
​​
version_id: "c3616c11844d5681fc78fb3661ad4c07"
​​
width: 3840
 */
