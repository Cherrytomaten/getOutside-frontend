import type { NextApiRequest, NextApiResponse } from 'next';
import { AUTH_TOKEN } from "@/types/constants";
import axios from "axios";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
    let authTokenString = _req.cookies[AUTH_TOKEN];
    if (authTokenString === undefined) {
        return res.status(400).json({errors: {message: 'Wrong token format.'}});
    }

    const authToken: TokenPayload = JSON.parse(authTokenString);

    return await axios.get('https://cherrytomaten.herokuapp.com/authentication/token', {
        headers: {
            "jwt": authToken.token
        }
    })
        .then((_res: any) => {
            return res.status(_res.response.status).json();
        })
        .catch((err: any) => {
            console.log("ERR",err);
            if (err.response.data.detail === undefined) {
                return res.status(err.response.status).json({ errors: { message: "A server error occured." } });
            }
            return res.status(err.response.status).json({ errors: { message: err.response.data.detail } });
        })
}
