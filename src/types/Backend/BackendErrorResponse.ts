import { AxiosResponse } from 'axios';
import { BackendErrorProps } from '@/types/Backend/BackendErrorProps';

type BackendErrorResponse = {
  response: AxiosResponse<BackendErrorProps>;
};

export type { BackendErrorResponse };
