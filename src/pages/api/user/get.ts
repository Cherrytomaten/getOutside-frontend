import { mockUser } from '@/simulation/userdataSim';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const userObj = mockUser.find((elem) => elem.userId === _req.query.userId);

  setTimeout(async () => {
    // wrong request method
    if (_req.method !== 'GET') {
      return res.status(405).json({
        errors: { message: 'Given request method is not allowed here.' },
      });
    }

    if (!userObj) {
      return res.status(404).json({
        errors: {
          message: `No user found with given ID: ${_req.query.userId}`,
        },
      });
    } else {
      if (userObj.token !== _req.query.token) {
        return res.status(400).json({
          errors: { message: 'User token and request token do not match.' },
        });
      } else {
        return res.status(200).json(userObj);
      }
    }
  }, 200);
}
