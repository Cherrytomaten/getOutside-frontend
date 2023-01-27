import type { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";
import { BackendErrorResponse } from "@/types/Backend/BackendErrorResponse";

type RevokeRequest = NextApiRequest & {
    body: {
        refreshToken: TokenPayload;
    }
}

/**
 * Put the cookied refresh token on a blacklist, so it becomes unusable
 * @param _req expects a body with the auth refresh token inside.
 * @param res on success returns void.
 */
export default async function handler(_req: RevokeRequest, res: NextApiResponse) {
    // wrong request method
    if (_req.method !== 'POST') {
        return res.status(405).json({errors: {message: 'Given request method is not allowed here.'}});
    }

    try {
        const refAuthToken: TokenPayload = JSON.parse(_req.body.refreshToken);

        return await axios.post('https://cherrytomaten.herokuapp.com/authentication/token/revoke/', {
            "refresh": refAuthToken.token,
        })
            .then((_res) => {
                return res.status(_res.status).end();
            })
            .catch((err: BackendErrorResponse) => {
                if (err.response?.data?.detail === undefined) {
                    return res.status(err.response?.status ? err.response?.status : 500).json({errors: {message: "A server error occured."}});
                }
                return res.status(err.response.status).json({errors: {message: err.response.data.detail}});
            })

    } catch(_err) {
        return res.status(400).json({errors: {message: 'Wrong token format.'}});
    }
}
