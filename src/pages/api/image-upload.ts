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
