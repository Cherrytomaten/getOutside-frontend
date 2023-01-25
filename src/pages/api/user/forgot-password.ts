import type { NextApiRequest, NextApiResponse } from 'next';
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";
import axios, { AxiosResponse } from "axios";

type ForgotPasswordRequest = NextApiRequest & {
    body: { email: string };
};

type ForgotPasswordResponseBody = {
    msg: string;
}

type ForgotPasswordErrorResponseProps = {
    error: string;
}

type ForgotPasswordErrorResponse = {
    response: AxiosResponse<ForgotPasswordErrorResponseProps>;
}

type ForgotPasswordResponse = NextApiResponse<ForgotPasswordResponseBody | FetchServerErrorResponse>;

export default async function handler(_req: ForgotPasswordRequest, res: ForgotPasswordResponse) {
    // wrong request method
    if (_req.method !== 'POST') {
        return res.status(405).json({errors: { message: 'Given request method is not allowed here.' } });
    }

    return await axios.post('https://cherrytomaten.herokuapp.com/authentication/user/password/reset/', {
        "email": _req.body.email,
    })
        .then((_res: AxiosResponse<ForgotPasswordResponseBody>) => {
            return res.status(201).json(_res.data);
        })
        .catch((err: ForgotPasswordErrorResponse) => {
            if (err.response?.data?.error === undefined) {
                return res.status(err.response.status).json({ errors: { message: "A server error occured." } });
            }
            return res.status(err.response.status).json({ errors: { message: err.response.data.error } });
        })
}
