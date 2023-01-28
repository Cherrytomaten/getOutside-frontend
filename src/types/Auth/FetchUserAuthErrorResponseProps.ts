import { NextApiResponse } from 'next';

type FetchUserAuthErrorResponseProps = {
  response: NextApiResponse & {
    data: {
      message: string;
    };
  };
};

export type { FetchUserAuthErrorResponseProps };
