import { LatLngExpression } from 'leaflet';
import axios from 'axios';
import { PinProps } from '@/types/Pins';
import { WrapperServerErrorResponse } from '@/types/Server/WrapperServerErrorResponse';
import { AddPinProps } from "@/types/Pins/AddPinProps";

class PinRepo {
  /**
   * Repo function to get all pins that match the range criteria.
   * @param location current location of the user as array [lat, long]
   * @param radius set radius to search for around the user location
   * @returns a list of all pins that match the requirements.
   */
  public async getByRadius(location: LatLngExpression, radius: number): Promise<any> {
    return await axios
      .get('/api/pins/get', {
        params: {
          location: location.toString(),
          radius: radius,
        },
      })
      .then((res: { data: PinProps[] }) => {
        return Promise.resolve(res.data);
      })
      .catch((err: WrapperServerErrorResponse) => {
        return Promise.reject(err.response.data);
      });
  }

  public async AddMappoint(pin: AddPinProps) {
    return await axios.post('/api/pins/add-pin', {
      pin
    })
      .then((res: { data: { uuid: string } }) => {
        return Promise.resolve(res.data);
      })
      .catch((err: WrapperServerErrorResponse) => {
        return Promise.reject(err.response.data);
      })
  }
}

export const PinRepoClass = new PinRepo();
