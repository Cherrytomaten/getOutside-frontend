import { NextApiResponse } from 'next';

type WrapperServerErrorResponse = {
  response: NextApiResponse & {
    data: {
      errors: {
        message: string;
      };
    };
  };
};

export type { WrapperServerErrorResponse };
