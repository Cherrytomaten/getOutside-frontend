import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProfilePage } from '@/components/Profile';
import { useAuth } from '@/context/AuthContext';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AUTH_TOKEN } from '@/types/constants';
import { tokenDecompiler } from '@/util/tokenDecompiler';
import dummyFetchData from '@/lib/dummyFetchData';
import { GetServerSidePropsContext } from 'next';

type MockData = UserProps & {
  MOCK_password: string;
};

type ProfileProps = {
  username: string;
  email: string;
  fname: string;
  lname: string;
  pic: string;
};

// TODO: ordentliche Typdeklarationen

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const tokenData: string | undefined = context.req.cookies[AUTH_TOKEN];

  try {
    if (tokenData === undefined) {
      throw new Error('TokenData is undefined!');
    }

    const { userId } = tokenDecompiler(tokenData);
    if (userId === '') {
      throw new Error('TokenData does not contain expected values.');
    }

    const user: MockData | string = await dummyFetchData(tokenData, userId);
    console.log('user: ', user);

    if (typeof user === 'string') {
      throw new Error('User is not an object!');
    }

    return {
      props: {
        username: user.username,
        email: user.email,
        fname: user.firstname,
        lname: user.lastname,
        pic: user.pic,
      },
    };
  } catch (err) {
    console.log('Error requesting profile page: ', err);
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
      email={userPayload.email}
      fname={userPayload.fname}
      lname={userPayload.lname}
      pic={userPayload.pic}
    />
  );
}

export default Profile;
