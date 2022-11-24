import type { NextApiRequest, NextApiResponse } from 'next';
import { isSamePassword } from "@/util/passwordManager";

type LoginServerRequest = NextApiRequest & {
    body: {
        email: string,
        password: string,
    }
}

type MockData = UserProps & {
    MOCK_password: string;
}

const mockUser: MockData[] = [{
    userId: "U1",
    firstname: 'Max',
    lastname: 'Mustermann',
    MOCK_password: '$2b$10$RozTlWGXFA1pL8K3ey0rguKEifNgOMzZIdn2xQU9UEMsXLyg73Oq2', // password123#
    email: 'max@mail.de',
    token: "Bearer ABCD1234",
    refreshToken: "Bearer EFGH5678",
    expiration: 1
}];


export default function handler(_req: LoginServerRequest, res: NextApiResponse) {
    const userObj = mockUser.find(elem => elem.email === _req.body.email);

    setTimeout(async () => {
        // wrong request method
        if (_req.method !== 'POST') {
            return res.status(405).json({errors: { message: 'Given request method is not allowed here.' } });
        }

        // no matching user mail found (obscure reason)
        if (!userObj) {
            return res.status(400).json({errors: { message: 'No matching data found for given email & password.' } });
        } else {
            if (await isSamePassword(_req.body.password, userObj.MOCK_password)) {
                // data correct -> return user object
                return res.status(200).json(userObj);
            } else {
                // wrong password (obscure reason)
                return res.status(400).json({errors: { message: 'No matching data found for given email & password.' } });
            }
        }
    }, 200)
}
