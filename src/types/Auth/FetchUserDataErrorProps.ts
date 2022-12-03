import { NextApiResponse } from "next";

type FetchUserDataErrorProps = {
    response: NextApiResponse & {
        data: {
            message: string
        }
    }
}

export type { FetchUserDataErrorProps };

