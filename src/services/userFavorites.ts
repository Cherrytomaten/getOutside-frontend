import axios, { AxiosResponse } from "axios";
import { BackendErrorResponse } from "@/types/Backend/BackendErrorResponse";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";
import { FavoritePinsList } from "@/types/Pins/FavoritePinsList";

async function getUserFavorites(authToken: TokenPayload): Promise<FavoritePinsList> {
  return await axios
    .get("https://cherrytomaten.herokuapp.com/api/favorites/pin/", {
      headers: {
        Authorization: "Bearer " + authToken.token,
      },
    })
    .then((res: AxiosResponse<FavoritePinsList>) => {
      return Promise.resolve(res.data);
    })
    .catch((_err: BackendErrorResponse) => {
      return Promise.reject(null);
    });
}

export { getUserFavorites };
