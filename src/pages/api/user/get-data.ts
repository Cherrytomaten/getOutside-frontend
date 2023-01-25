import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from "axios";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";
import { BackendErrorResponse } from "@/types/Backend/BackendErrorResponse";
import { UserDataProps } from "@/types/User/UserDataProps";

type UserDataResponseBody = {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture: string;
}

type UserDataResponse = NextApiResponse<UserDataProps | FetchServerErrorResponse>;

/**
 * Get detailed data about a user.
 * @param _req containing an access token in the header
 * @param res containing detailed information in the body or an error response
 */
export default async function handler(_req: NextApiRequest, res: UserDataResponse) {
    // wrong request method
    if (_req.method !== 'GET') {
        return res.status(405).json({errors: { message: 'Given request method is not allowed here.' } });
    }

    return await axios.get('https://cherrytomaten.herokuapp.com/authentication/user/')
        .then((_res: AxiosResponse<UserDataResponseBody>) => {
            return res.status(201).json({
                username: _res.data.username,
                fname: _res.data.first_name,
                lname: _res.data.last_name,
                email: _res.data.email,
                pfp: _res.data.profile_picture
            });
        })
        .catch((err: BackendErrorResponse) => {
            if (err.response?.data?.detail === undefined) {
                return res.status(err.response.status).json({ errors: { message: "A server error occured." } });
            }
            return res.status(err.response.status).json({ errors: { message: err.response.data.detail } });
        })
}
