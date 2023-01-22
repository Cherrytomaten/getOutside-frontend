import type { NextApiRequest, NextApiResponse } from 'next';
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";
import axios, { AxiosResponse } from "axios";

type ResetPasswordRequest = NextApiRequest & {
    body: {
        user_id: string;
        user_mail: string;
        confirmation_token: string;
        password: string;
        password2: string;
    };
};

type ResetPasswordResponseBody = {
    msg: string;
}

type ResetPasswordErrorResponseProps = {
    error: string;
}

type ResetPasswordErrorResponse = {
    response: AxiosResponse<ResetPasswordErrorResponseProps>;
}

type ForgotPasswordResponse = NextApiResponse<ResetPasswordResponseBody | FetchServerErrorResponse>;

export default async function handler(_req: ResetPasswordRequest, res: ForgotPasswordResponse) {
    // wrong request method
    if (_req.method !== 'PUT') {
        return res.status(405).json({errors: { message: 'Given request method is not allowed here.' } });
    }

    return await axios({
        method: 'put',
        url: 'https://cherrytomaten.herokuapp.com/authentication/user/password/reset/',
        maxBodyLength: 104857600, //100mb
        maxContentLength: 104857600, //100mb
        data: {
            "user_id": _req.body.user_id,
            "user_mail": _req.body.user_mail,
            "confirmation_token": _req.body.confirmation_token,
            "password": _req.body.password,
            "password2": _req.body.password2
        }
    })
        .then((_res: AxiosResponse<ResetPasswordResponseBody>) => {
        return res.status(201).json(_res.data);
    })
        .catch((err: ResetPasswordErrorResponse) => {
            console.log("ERR", err);
            if (err.response?.data?.error === undefined) {
                return res.status(err.response?.status || 500).json({ errors: { message: "A server error occured." } });
            }
            return res.status(err.response.status).json({ errors: { message: err.response.data.error } });
        })

/*
    return await axios.put('https://cherrytomaten.herokuapp.com/authentication/user/password/reset/', {
        "user_id": _req.body.user_id,
        "user_mail": _req.body.user_mail,
        "confirmation_token": _req.body.confirmation_token,
        "password": _req.body.password,
        "password2": _req.body.password2
    })
        .then((_res: AxiosResponse<ResetPasswordResponseBody>) => {
            return res.status(201).json(_res.data);
        })
        .catch((err: ResetPasswordErrorResponse) => {
            console.log("ERR", err);
            if (err.response?.data?.error === undefined) {
                return res.status(err.response.status).json({ errors: { message: "A server error occured." } });
            }
            return res.status(err.response.status).json({ errors: { message: err.response.data.error } });
        })

 */
}
