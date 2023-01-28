import axios from 'axios';
import { WrapperServerErrorResponse } from '@/types/Server/WrapperServerErrorResponse';

class FavRepo {
  public async add(pinId: string): Promise<any> {
    return await axios
      .post('/api/favorites/add', {
        pinId: pinId,
      })
      .then((_res) => {
        return Promise.resolve();
      })
      .catch((err: WrapperServerErrorResponse) => {
        return Promise.reject(err.response.data);
      });
  }
}

export const FavRepoClass = new FavRepo();
