import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProfilePage } from '@/components/Profile';
import { useAuth } from '@/context/AuthContext';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AUTH_TOKEN } from '@/types/constants';
import { tokenDecompiler } from '@/util/tokenDecompiler';
import dummyFetchData from '@/lib/dummyFetchData';

type MockData = UserProps & {
  MOCK_password: string;
};

// TODO: ordentliche Typdeklarationen

export async function getServerSideProps(context: any) {
  const tokenData = context.req.cookies[AUTH_TOKEN];

  try {
    const { userId } = tokenDecompiler(tokenData);
    if (userId === '') {
      throw new Error('TokenData does not contain expected values.');
    }

    const user: MockData | string = await dummyFetchData(tokenData, userId);
    console.log('user: ', user);

    return {
      props: { user },
    };
  } catch (err) {
    console.log('Error requesting profile page: ', err);
    return {
      notFound: true,
    };
  }
}

function Profile({ user }: any) {
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

  return <ProfilePage user={user} />;
}

export default Profile;
