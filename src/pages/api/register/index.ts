import type { NextApiRequest, NextApiResponse } from 'next';
import { RegisterUserProps } from "@/types/User/RegisterUserProps";
import axios from "axios";
import { FetchRegisterDataResponse } from "@/types/User/FetchRegisterDataResponse";
import { BackendErrorResponse } from "@/types/Backend/BackendErrorResponse";

type RegisterServerRequest = NextApiRequest & {
    body: { user: RegisterUserProps };
};

export default async function handler(_req: RegisterServerRequest, res: NextApiResponse) {
    return await axios.post('https://cherrytomaten.herokuapp.com/authentication/user/create/', {
        "username": _req.body.user.username,
        "password": _req.body.user.password,
        "email": _req.body.user.email
    })
        .then((_res: FetchRegisterDataResponse) => {
            return res.status(201).json(_res.data);
        })
        .catch((err: BackendErrorResponse) => {
            if (err.response.data.detail === undefined) {
                return res.status(err.response.status).json({ errors: { message: "A server error occured." } });
            }
            return res.status(err.response.status).json({ errors: { message: err.response.data.detail } });
        })
}
