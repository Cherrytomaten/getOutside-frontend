import type { NextApiRequest, NextApiResponse } from 'next';

type MapPointApiRequest = NextApiRequest & {
  query: {
    mapPointUuid: string;
  };
};

export default function handler(
  _req: MapPointApiRequest,
  res: NextApiResponse
) {
  try {
    setTimeout(async () => {
      return res.status(200);
    }, 200);
  } catch (error) {
    setTimeout(async () => {
      return res.status(404).json(error);
    }, 404);
  }
}
