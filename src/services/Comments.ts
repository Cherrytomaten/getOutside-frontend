import axios, { AxiosResponse } from 'axios';
import { WrapperServerErrorResponse } from '@/types/Server/WrapperServerErrorResponse';
import { logger } from '@/util/logger';

type commentProps = {
  mappointId: string;
  text: string;
};

class Comments {
  async postNewComment(commentData: commentProps): Promise<AxiosResponse<any>> {
    return await axios
      .post('/api/pins/add-comment', {
        mappointId: commentData.mappointId,
        text: commentData.text,
      })
      .then((res: any) => {
        logger.log('comments service response:', res);
        return Promise.resolve(res);
      })
      .catch((err: WrapperServerErrorResponse) => {
        logger.log('comments service error:', err.response.data);
        return Promise.reject(err.response.data);
      });
  }

  async deleteComment(commentId: string): Promise<AxiosResponse<any>> {
    return await axios
      .delete('/api/pins/delete-comment', {
        params: {
          commentId: commentId,
        },
      })
      .then((res: any) => {
        logger.log('comments service response:', res);
        return Promise.resolve(res.status);
      })
      .catch((err: WrapperServerErrorResponse) => {
        logger.log('comments service error:', err.response.data);
        return Promise.reject(err.response.data);
      });
  }
}

export const commentsService = new Comments();
