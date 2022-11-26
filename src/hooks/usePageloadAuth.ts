import { getCookie } from "@/util/cookieManager";
import { AUTH_REFRESH_TOKEN, AUTH_TOKEN } from "@/types/constants";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

function usePageloadAuth() {
    const [authStatus, setAuthStatus] = useState<boolean>(true);
    const { fetchUserAuthState, sendToUserAuthMachine, UserRepoClass } = useAuth();

    // check if a token was cookied. If not redirect to login page, otherwise try to fetch userdata by token
    function validateUser() {
        if (fetchUserAuthState.matches('pending')) {
            return;
        }

        console.log("trying to validate user...");
        const tokenCookie = getCookie(AUTH_TOKEN);
        if (tokenCookie !== null) {
            sendToUserAuthMachine({ type: 'FETCH_AUTH_USER', payload: { token: tokenCookie } });
        } else {
            setAuthStatus(false);
        }
    }

    // on load auth check
    useEffect(() => {
        if (fetchUserAuthState.context.user === null) {
            validateUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // if token exists as cookie, but auth still failed, redirect to log in aswell
    useEffect(() => {
        if (fetchUserAuthState.matches('failure')) {
            if (!fetchUserAuthState.context.refreshAttempted) {
                sendToUserAuthMachine({ type: 'RETRY', payload: { refreshToken: getCookie(AUTH_REFRESH_TOKEN) } });
            } else {
                setAuthStatus(false);
            }
        }
    }, [fetchUserAuthState, sendToUserAuthMachine])

    return { authStatus, setAuthStatus };
}

export { usePageloadAuth };
