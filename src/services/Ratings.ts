import axios, { AxiosResponse } from 'axios';
import { WrapperServerErrorResponse } from '@/types/Server/WrapperServerErrorResponse';
import { logger } from '@/util/logger';

type commentProps = {
  mappointId: string;
  text: string;
};

class Ratings {
  async postNewRating(rateId: number, mappointId: string): Promise<AxiosResponse<any>> {
    return await axios
      .post('/api/pins/rating', {
        rating: rateId,
        mappointId: mappointId,
      })
      .then((res: any) => {
        logger.log('rating service response:', res);
        return Promise.resolve(res);
      })
      .catch((err: WrapperServerErrorResponse) => {
        logger.log('rating service error:', err.response.data);
        return Promise.reject(err.response.data);
      });
  }
}

export const ratingService = new Ratings();
