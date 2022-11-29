import { Loading } from "@/components/Loading";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useUserAuth } from "@/hooks/useUserAuth";

function Home() {
    const router = useRouter();
    const AuthenticationHook = useUserAuth();
    const { fetchUserAuthState } = useAuth();

    if (!AuthenticationHook.authStatus) {
        router.push('/login');
    }

    if (fetchUserAuthState.context.user === null) {
        return <Loading />;
    }

    return (
        <main className="w-full h-screen flex justify-center items-center bg-dark-sea">
            <div className="flex flex-col">
                <h2>Homepage</h2>
                <p>Hello {fetchUserAuthState.context.user.firstname}</p>
                <button onClick={() => AuthenticationHook.logout() }>Logout</button>
            </div>

        </main>
    );
}

export default Home;
