import type { NextApiRequest, NextApiResponse } from 'next';
import { mockMapPoints } from "@/simulation/mappoints";

type MapPointApiRequest = NextApiRequest & {
  query: {
    mapPointUuid: string;
  };
};

/**
 * Get data for a specific mappoint.
 * @param _req containing the uuid for the desired mappoint in the header
 * @param res contains data for the desired mappoint in the body
 */
export default function handler(
  _req: MapPointApiRequest,
  res: NextApiResponse
) {
  // wrong request method
  if (_req.method !== 'GET') {
    return res.status(405).json({errors: {message: 'Given request method is not allowed here.'}});
  }

  const mapPointObj = mockMapPoints.find(
    (elem) => elem.uuid === _req.query.uuid
  );

  try {
    setTimeout(async () => {
      return res.status(200).json(mapPointObj);
    }, 200);
  } catch (error) {
    setTimeout(async () => {
      return res.status(404).json(error);
    }, 404);
  }
}
