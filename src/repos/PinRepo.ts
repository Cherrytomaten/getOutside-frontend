import { LatLngExpression } from "leaflet";
import axios from "axios";
import { PinProps } from "@/types/Pins";
import { FetchUserAuthErrorResponseProps } from "@/types/Auth/FetchUserAuthErrorResponseProps";

class PinRepo {
    /**
     * Repo function to get all pins that match the range criteria.
     * @param location current location of the user as array [lat, long]
     * @param radius set radius to search for around the user location
     * @returns a list of all pins that match the requirements.
     */
    public static async getByRadius(location: LatLngExpression, radius: number): Promise<any> {
        return await axios.get('/api/pins/get', {
            params: {
                location: location.toString(),
                radius: radius
            }
        })
            .then((res: { data: PinProps[] }) => {
                return Promise.resolve(res.data);
            })
            .catch((err: FetchUserAuthErrorResponseProps) => {
                return Promise.reject(err.response.data);
            });
    }
}

export { PinRepo };
