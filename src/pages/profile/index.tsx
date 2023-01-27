import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProfilePage } from '@/components/Profile';
import { useAuth } from '@/context/AuthContext';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AUTH_TOKEN } from '@/types/constants';
import { GetServerSidePropsContext } from 'next';
import axios, { AxiosResponse } from 'axios';
import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';
import { logger } from '@/util/logger';

type UserDataServerResponseProps = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string | null;
};

type UserDataServerResponse = AxiosResponse<UserDataServerResponseProps>;

type ProfileProps = {
  username: string;
  fname: string;
  lname: string;
  email: string;
  pic: string | null;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const tokenData: string | undefined = context.req.cookies[AUTH_TOKEN];

  try {
    if (tokenData === undefined || tokenData === 'undefined') {
      throw new Error('TokenData is undefined!');
    }

    const authToken: TokenPayload = JSON.parse(tokenData);

    return await axios
      .get('https://cherrytomaten.herokuapp.com/authentication/user/', {
        headers: {
          Authorization: 'Bearer ' + authToken.token,
        },
      })
      .then((_res: UserDataServerResponse) => {
        logger.log('page props from server: ', _res.data);
        return {
          props: {
            username: _res.data.username,
            fname: _res.data.first_name,
            lname: _res.data.last_name,
            email: _res.data.email,
            pic: _res.data.profile_picture,
          },
        };
      })
      .catch((_err: BackendErrorResponse) => {
        throw new Error('Internal Server Error.');
      });
  } catch (err: any) {
    logger.log('Error requesting profile page:', err);
    return {
      notFound: true,
    };
  }
}

function Profile({ ...userPayload }: ProfileProps) {
  const router = useRouter();
  const authenticationHook = useUserAuth();
  const { fetchUserAuthState } = useAuth();

  useEffect(() => {
    if (!authenticationHook.authStatus) {
      router.push('/login');
    }
  }, [authenticationHook.authStatus, router]);

  if (fetchUserAuthState.context.user === null) {
    return <LoadingSpinner />;
  }

  return (
    <ProfilePage
      username={userPayload.username}
      fname={userPayload.fname}
      lname={userPayload.lname}
      email={userPayload.email}
      pic={userPayload.pic}
    />
  );
}

export default Profile;
