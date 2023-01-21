import type { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios";
import { FetchRegisterDataResponse } from "@/types/User/FetchRegisterDataResponse";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";
import { BackendErrorResponse } from "@/types/Backend/BackendErrorResponse";

type ConfirmEmailRequest = NextApiRequest & {
    body: { email: string };
};

type RegisterResponse = NextApiResponse<{username: string, email: string} | FetchServerErrorResponse>;

export default async function handler(_req: ConfirmEmailRequest, res: RegisterResponse) {
    return await axios.post('https://cherrytomaten.herokuapp.com/authentication/user/confirm-email/', {
        "email": _req.body.email,
    })
        .then((_res: FetchRegisterDataResponse) => {
            return res.status(201).json(_res.data);
        })
        .catch((err: BackendErrorResponse) => {
            if (err.response?.data?.detail === undefined) {
                return res.status(err.response.status).json({ errors: { message: "A server error occured." } });
            }
            return res.status(err.response.status).json({ errors: { message: err.response.data.detail } });
        })
}
