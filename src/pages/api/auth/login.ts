import type { NextApiRequest, NextApiResponse } from 'next';
import { isSamePassword } from "@/util/passwordManager";
import { mockUser } from "@/simulation/userdataSim";

type LoginServerRequest = NextApiRequest & {
  body: {
    username: string;
    password: string;
  };
};

export default function handler(_req: LoginServerRequest, res: NextApiResponse) {
    const userObj = mockUser.find(
      (elem) => elem.username === _req.body.username
    );

    setTimeout(async () => {
        // wrong request method
        if (_req.method !== 'POST') {
            return res.status(405).json({errors: { message: 'Given request method is not allowed here.' } });
        }

        // no matching user mail found (obscure reason)
        if (!userObj) {
            return res
              .status(400)
              .json({
                errors: {
                  message:
                    'No matching data found for given username & password.',
                },
              });
        } else {
            if (await isSamePassword(_req.body.password, userObj.MOCK_password)) {
                // data correct -> return user object
                return res.status(200).json(userObj);
            } else {
                // wrong password (obscure reason)
                return res
                  .status(400)
                  .json({
                    errors: {
                      message:
                        'No matching data found for given username & password.',
                    },
                  });
            }
        }
    }, 200)
}
