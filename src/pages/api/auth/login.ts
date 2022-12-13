import type { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios";
import { BackendErrorResponse } from "@/types/Backend/BackendErrorResponse";
import { tokenDecompiler } from "@/util/tokenDecompiler";
import { UserAuthProps } from "@/types/User";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";

type LoginServerRequest = NextApiRequest & {
  body: {
    username: string;
    password: string;
  };
};

type LoginResponse = NextApiResponse<UserAuthProps | FetchServerErrorResponse>;

type BackendLoginResponseData = {
    data: {
        access: string,
        refresh: string
    }
}

export default async function handler(_req: LoginServerRequest, res: LoginResponse) {
    return await axios.post('https://cherrytomaten.herokuapp.com/authentication/token/obtain/', {
        "username": _req.body.username,
        "password": _req.body.password
    })
        .then((_res: BackendLoginResponseData) => {
            const accessToken = tokenDecompiler(_res.data.access);
            const refreshToken = tokenDecompiler(_res.data.refresh);

            if (accessToken === null || refreshToken === null) {
                return res.status(400).json({ errors: { message: "A server error occured." } });
            } else {
                return res.status(200).json({ userId: accessToken.userId, access: accessToken, refresh: refreshToken });
            }
        })
        .catch((err: BackendErrorResponse) => {
            console.log("ERR",err);
            if (err.response.data.detail === undefined) {
                return res.status(err.response.status).json({ errors: { message: "A server error occured." } });
            }
            return res.status(err.response.status).json({ errors: { message: err.response.data.detail } });
        })
}
