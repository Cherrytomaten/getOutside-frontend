import { mockUser } from '@/simulation/userdataSim';

type MockData = UserProps & {
  MOCK_password: string;
};

export default async function dummyFetchData(
  tokenData: string,
  userId: string
): Promise<MockData | string> {
  const userObj = mockUser.find((elem) => elem.userId === userId);

  if (!userObj) {
    console.log('userObj undefined - reject');
    return Promise.reject(`No userObj found with given ID: ${userId}`);
  } else {
    if (userObj.token !== tokenData) {
      console.log('token does not match - reject');
      return Promise.reject('User token and request token do not match.');
    } else {
      console.log('resolve!');
      return Promise.resolve(userObj);
    }
  }
}
