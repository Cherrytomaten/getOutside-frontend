import { NextApiResponse } from "next";

type WrapperServerErrorResponse = {
    response: NextApiResponse & {
        data: {
            message: string
        }
    }
}

export type { WrapperServerErrorResponse };

