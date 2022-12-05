import Map from '@/components/Map';
import { useRouter } from "next/router";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useEffect } from "react";

function Home() {
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
        <>
            <Map />
            <button onClick={() => authenticationHook.logout()}>Logout</button>
        </>
    );
}

export default Home;
