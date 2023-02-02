import axios from "axios";
import { WrapperServerErrorResponse } from "@/types/Server/WrapperServerErrorResponse";
import { logger } from "@/util/logger";
import { PinCategoriesList } from "@/types/Pins/PinCategories";

async function getPinCategories(): Promise<PinCategoriesList> {
  return await axios.get('/api/pins/categories')
    .then((res: { data: PinCategoriesList }) => {
      return Promise.resolve(res.data);
    })
    .catch((_err: WrapperServerErrorResponse) => {
      logger.log(_err.response.data.errors.message);
      return Promise.resolve([{ id: '' }]);
    })
}

export { getPinCategories };
