import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from "axios";
import { logger } from '@/util/logger';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';
import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { AUTH_TOKEN } from '@/types/constants';
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";
import { PinCategoriesList } from "@/types/Pins/PinCategories";

type GetAllCategoriesResponse = NextApiResponse<PinCategoriesList | FetchServerErrorResponse>;

/**
 * Get all possible categories for mappoints
 * @param _req auth token in header
 * @param res array of all possible categories or an error response
 */
export default async function handler(_req: NextApiRequest, res: GetAllCategoriesResponse) {
  // wrong request method
  if (_req.method !== 'GET') {
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
      .get('https://cherrytomaten.herokuapp.com/api/category/public', {
        headers: {
          Authorization: 'Bearer ' + authToken.token,
        },
      })
      .then((_res: AxiosResponse<PinCategoriesList>) => {
        return res.status(200).json(_res.data);
      })
      .catch((err: BackendErrorResponse) => {
        if (err.response?.data?.detail === undefined) {
          return res.status(err.response?.status ? err.response?.status : 500).json({ errors: { message: 'A server error occured.' } });
        }
        return res.status(err.response.status).json({ errors: { message: err.response.data.detail } });
      });
  } catch (_err) {
    logger.log('Error fetching categories: ', _err);
    return res.status(400).json({ errors: { message: 'Error fetching categories.' } });
  }
}
