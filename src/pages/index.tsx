import { Loading } from "@/components/Loading";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getCookie } from "@/util/cookieManager";
import { AUTH_TOKEN } from "@/types/constants";

function Home() {
    const router = useRouter();
    const { fetchUserAuthState, sendToUserAuthMachine, UserRepoClass } = useAuth();

    useEffect(() => {
        if (fetchUserAuthState.context.user === null) {
            //TODO: Check cookies for token and do data request
            const token = getCookie(AUTH_TOKEN);
            if (token !== null) {
                UserRepoClass.getUserByToken(token)
                    .then((res: UserProps) => {

                    })
            }

            router.push('/login');
        }
    }, []);

    if (fetchUserAuthState.context.user === null) {
        return <Loading />;
    }

    return (
        <main className="w-full h-screen flex justify-center items-center bg-dark-sea">
            <h2>Homepage</h2>
            <p>Hello {fetchUserAuthState.context.user.firstname}</p>
        </main>
    );
}

export default Home;
