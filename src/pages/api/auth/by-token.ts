import type { NextApiRequest, NextApiResponse } from 'next';
import { mockUser } from "@/simulation/userdataSim";

type LoginServerRequest = NextApiRequest & {
    body: {
        email: string,
        password: string,
    }
}

export default function handler(_req: LoginServerRequest, res: NextApiResponse) {
    const userObj = mockUser.find(elem => elem.token === _req.query.token);

    setTimeout(async () => {
        // wrong request method
        if (_req.method !== 'GET') {
            return res.status(405).json({errors: { message: 'Given request method is not allowed here.' } });
        }
        if (!userObj) {
            return res.status(400).json({errors: { message: 'Can\'t identify token.' } });
        } else {
            return res.status(200).json(userObj);
        }
    }, 200)
}
