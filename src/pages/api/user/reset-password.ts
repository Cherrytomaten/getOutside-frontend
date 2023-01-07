import type { NextApiRequest, NextApiResponse } from 'next';
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";

type ResetPasswordRequest = NextApiRequest & {
    body: { email: string };
};

type ResetPasswordResponse = NextApiResponse<{message: string} | FetchServerErrorResponse>;

export default async function handler(_req: ResetPasswordRequest, res: ResetPasswordResponse) {

    // wrong request method
    if (_req.method !== 'POST') {
        return res.status(405).json({errors: { message: 'Given request method is not allowed here.' } });
    }

    return res.status(200).end();
}
