import { getCookie } from "@/util/cookieManager";
import { AUTH_REFRESH_TOKEN, AUTH_TOKEN } from "@/types/constants";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";


/**
 * User authentication hook that runs on page load to check if the current
 * user is correctly validate. If not the useState variable will be set to false.
 * The hook also checks if an attempted validation with an existing cookie failed and
 * runs the refresh function for trying to get a refresh token.
 * Also provides a logout function.
 */
function useUserAuth() {
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

    function logout() {
        sendToUserAuthMachine({ type: 'LOGOUT' });
        setAuthStatus(false);
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

    return { authStatus, setAuthStatus, logout };
}

export { useUserAuth };