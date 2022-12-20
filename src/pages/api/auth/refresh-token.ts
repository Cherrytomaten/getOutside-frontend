import type { NextApiRequest, NextApiResponse } from 'next';
import { mockUser } from "@/simulation/userdataSim";
import axios from "axios";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";
import { UserAuthProps } from "@/types/User";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";

type RefreshTokenRequest = NextApiRequest & {
    body: {
        refreshToken: TokenPayload;
    }
}

type RefreshTokenResponse = NextApiResponse<UserAuthProps | FetchServerErrorResponse>;

type RefreshTokenServerResponseData = {
    data: {
        access: string;
        refresh: string;
    }
}

/**
 * Get a new set of access & refresh token, based on the provided refresh token.
 * @param _req expects a body of following content { refreshToken: TokenPayload }
 * @param res on success returns a new set of access & refresh token.
 */
export default async function handler(_req: RefreshTokenRequest, res: RefreshTokenResponse) {
    const userObj = mockUser.find(elem => elem.refreshToken === _req.query.refToken);

    setTimeout(async () => {
        // wrong request method
        if (_req.method !== 'GET') {
            return res.status(405).json({errors: { message: 'Given request method is not allowed here.' } });
        }

        return await axios.post('https://cherrytomaten.herokuapp.com/authentication/token/refresh/', {
            "refresh": _req.body.refreshToken
        })


        if (!userObj) {
            return res.status(400).json({errors: { message: 'Can\'t identify token.' } });
        } else {
            const tokenPayload = {
                token: userObj.token,
                refreshToken: userObj.refreshToken,
                expiration: userObj.expiration
            }
            return res.status(200).json(tokenPayload);
        }
    }, 200)
}
