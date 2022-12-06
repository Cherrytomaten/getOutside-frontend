import type { NextApiRequest, NextApiResponse } from 'next';
import { mockUser } from "@/simulation/userdataSim";
import { RegisterUserProps } from "@/types/User/RegisterUserProps";

type RegisterServerRequest = NextApiRequest & {
    body: RegisterUserProps;
};

export default function handler(_req: RegisterServerRequest, res: NextApiResponse) {
    const userObj = mockUser.find(elem => elem.username === _req.body.user.username);

    setTimeout(async () => {
        // wrong request method
        if (_req.method !== 'POST') {
            return res.status(405).json({errors: { message: 'Given request method is not allowed here.' } });
        }
        if (userObj) {
            return res.status(409).json({errors: { message: 'Username already exists.' } });
        } else {
            return res.status(200).json({ email: _req.body.user.email, username: _req.body.user.username });
        }
    }, 200)
}
