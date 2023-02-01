import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProfilePage } from '@/components/Profile';
import { useAuth } from '@/context/AuthContext';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { AUTH_TOKEN } from '@/types/constants';
import { GetServerSidePropsContext } from 'next';
import axios, { AxiosResponse } from 'axios';
import { TokenPayload } from '@/types/Auth/TokenPayloadProps';
import { BackendErrorResponse } from '@/types/Backend/BackendErrorResponse';
import { logger } from '@/util/logger';
import { UserRepoClass } from "@/repos/UserRepo";
import { UserDataProps } from "@/types/User/UserDataProps";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";

type UserDataServerResponseProps = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  cloud_pic: string | null;
};

type UserDataServerResponse = AxiosResponse<UserDataServerResponseProps>;

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
            pfp: _res.data.cloud_pic,
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

function Profile({ ...userPayload }: UserDataProps) {
  const router = useRouter();
  const authenticationHook = useUserAuth();
  const { fetchUserAuthState } = useAuth();
  const [userData, setUserData] = useState<UserDataProps>(userPayload);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!authenticationHook.authStatus) {
      router.push('/login');
    }
  }, [authenticationHook.authStatus, router]);

  useEffect(() => {
    setIsLoading(true);
    UserRepoClass.getUserData()
      .then((res: UserDataProps) => {
        setUserData(res);
        setIsLoading(false);
      })
      .catch((err: FetchServerErrorResponse) => {
        logger.log(err.errors.message);
        setUserData({
          username: '',
          fname: '',
          lname: '',
          email: '',
          pfp: '',
        })
        setIsLoading(false);
      })
  }, []);

  if (fetchUserAuthState.context.user === null || isLoading) {
    return <LoadingSpinner />;
  }

  return <ProfilePage username={userData.username} fname={userData.fname} lname={userData.lname} email={userData.email} pic={userData.pfp} />;
}

export default Profile;
