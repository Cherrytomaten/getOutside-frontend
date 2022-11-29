import type { NextApiRequest, NextApiResponse } from 'next';
import { mockUser } from "@/simulation/userdataSim";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
    const userObj = mockUser.find(elem => elem.refreshToken === _req.query.refToken);

    setTimeout(async () => {
        // wrong request method
        if (_req.method !== 'GET') {
            return res.status(405).json({errors: { message: 'Given request method is not allowed here.' } });
        }
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
