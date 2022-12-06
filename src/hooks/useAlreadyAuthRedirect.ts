import { AuthStateMachine } from "@/types/Auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCookie } from "@/util/cookieManager";
import { AUTH_TOKEN } from "@/types/constants";

/**
 * Simple hook for pages that shouldn't be accessed when already authenticated.
 * @param stateMachine stateMachine object that's responsible for the auth state management
 */
function useAlreadyAuthRedirect(stateMachine: AuthStateMachine) {
    const [alreadyAuth, setAlreadyAuth] = useState<boolean | null>(null);
    const router = useRouter();

    // auth redirect
    useEffect(() => {
        if (getCookie(AUTH_TOKEN) !== null) {
            setAlreadyAuth(true);
            router.push('/home');
        } else {
            setAlreadyAuth(false);
        }
    }, [router, stateMachine, stateMachine.context]);

    return alreadyAuth;
}

export { useAlreadyAuthRedirect };
