import { Loading } from "@/components/Loading";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { usePageloadAuth } from "@/hooks/usePageloadAuth";

function Home() {
    const router = useRouter();
    const pageloadAuthHook = usePageloadAuth();
    const { fetchUserAuthState, sendToUserAuthMachine } = useAuth();

    if (!pageloadAuthHook.authStatus) {
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
                <button onClick={() => console.log(fetchUserAuthState.context)}>Click</button>
            </div>

        </main>
    );
}

export default Home;
