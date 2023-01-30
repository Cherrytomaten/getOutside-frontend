import axios, { AxiosResponse } from 'axios';
import { WrapperServerErrorResponse } from '@/types/Server/WrapperServerErrorResponse';

type commentProps = {
  mappointId: string;
  text: string;
};

class Comments {
  async postNewComment(commentData: commentProps): Promise<AxiosResponse<any>> {
    return await axios
      .post('/api/pins/comments', {
        mappointId: commentData.mappointId,
        text: commentData.text,
      })
      .then((res: any) => {
        return Promise.resolve(res);
      })
      .catch((err: WrapperServerErrorResponse) => {
        return Promise.reject(err.response.data);
      });
  }
}

export const commentsService = new Comments();
