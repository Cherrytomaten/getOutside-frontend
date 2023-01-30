import axios from 'axios';
import { WrapperServerErrorResponse } from '@/types/Server/WrapperServerErrorResponse';
import { FavoritePinsList } from "@/types/Pins/FavoritePinsList";

class FavRepo {
  /**
   * Add a pin to the users favorite list
   * @param pinId the id of the pin that should be added to the list
   * @returns true or an error response
   */
  public async add(pinId: string): Promise<boolean> {
    return await axios
      .post('/api/favorites/add', {
        pinId: pinId,
      })
      .then((_res) => {
        return Promise.resolve(true);
      })
      .catch((err: WrapperServerErrorResponse) => {
        return Promise.reject(err.response.data);
      });
  }

  /**
   * Get the list of all favorites from a user
   * @returns a list of all favorites or an error response
   */
  public async get(): Promise<FavoritePinsList> {
    return await axios.get('/api/favorites/get')
      .then((_res: { data: FavoritePinsList }) => {
        return Promise.resolve(_res.data);
      })
      .catch((err: WrapperServerErrorResponse) => {
        return Promise.reject(err.response.data);
      });
  }

  /**
   * Remove a pin from the users favorite list
   * @param pinId the id of the pin that should be removed from the list
   * @returns true or an error response
   */
  public async delete(pinId: string): Promise<boolean> {
    return await axios.delete('/api/favorites/delete', {
      data: {
        pinId: pinId
      }
    })
      .then((_res) => {
        return Promise.resolve(true);
      })
      .catch((err: WrapperServerErrorResponse) => {
        return Promise.reject(err.response.data);
      })
  }
}

export const favRepoClass = new FavRepo();
