import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from "axios";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";

type ActivateUserRequest = NextApiRequest & {
    query: {
        user_id: string;
        confirmation_token: string;
        user_mail: string;
    };
};

type ActivateUserResponseBody = {
    msg: string;
}

type ActivateUserErrorResponseProps = {
    msg?: string;
}

type ActivateUserErrorResponse = {
    response: AxiosResponse<ActivateUserErrorResponseProps>;
}

type ActivateUserResponse = NextApiResponse<ActivateUserResponseBody | FetchServerErrorResponse>;

/**
 * After a user submit his register data, he can activate his account with the credentials found in the email he got.
 * @param _req containing the parameters to activate the user
 * @param res short success message or error response
 */
export default async function handler(_req: ActivateUserRequest, res: ActivateUserResponse) {
    // wrong request method
    if (_req.method !== 'GET') {
        return res.status(405).json({errors: { message: 'Given request method is not allowed here.' } });
    }

    return await axios.get('https://cherrytomaten.herokuapp.com/authentication/user/activate/', {
        params: {
            user_id: _req.query.user_uuid,
            confirmation_token: _req.query.confirmation_token,
            user_mail: _req.query.user_mail
        }
    })
        .then((_res: AxiosResponse<ActivateUserResponseBody>) => {
            return res.status(201).json(_res.data);
        })
        .catch((err: ActivateUserErrorResponse) => {
            if (err.response?.data?.msg === undefined) {
                return res.status(err.response.status).json({ errors: { message: "A server error occured." } });
            }
            return res.status(err.response.status).json({ errors: { message: err.response.data.msg } });
        })
}
