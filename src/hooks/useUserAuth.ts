import { getCookie } from "@/util/cookieManager";
import { AUTH_REFRESH_TOKEN, AUTH_TOKEN } from "@/types/constants";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { logger } from "@/util/logger";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";


/**
 * User authentication hook that runs on page load to check if the current
 * user is correctly validate. If not the useState variable will be set to false.
 * The hook also checks if an attempted validation with an existing cookie failed and
 * runs the refresh function for trying to get a refresh token.
 * Also provides a logout function.
 */
function useUserAuth() {
    const [authStatus, setAuthStatus] = useState<boolean>(true);
    const {fetchUserAuthState, sendToUserAuthMachine} = useAuth();
    const watcher: React.MutableRefObject<NodeJS.Timeout | null> = useRef(null);

    // check if a token was cookied. If not redirect to login page, otherwise try to fetch userdata by token
    function validateUser() {
        if (fetchUserAuthState.matches('pending')) {
            return;
        }

        logger.log("trying to validate user...");
        const tokenCookie = getCookie(AUTH_TOKEN);
        if (tokenCookie !== null) {
            sendToUserAuthMachine({type: 'FETCH_AUTH_USER', payload: {byToken: true}});
        } else {
            setAuthStatus(false);
        }
    }


    function logout() {
        sendToUserAuthMachine({type: 'LOGOUT'});
        setAuthStatus(false);
    }

    // on load auth check
    useEffect(() => {
        if (fetchUserAuthState.context.user === null) {
            validateUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // if token exists as cookie, but auth still failed, redirects to log in as well.
        if (fetchUserAuthState.matches('failure')) {
            if (!fetchUserAuthState.context.refreshAttempted) {
                sendToUserAuthMachine({type: 'RETRY', payload: {refreshToken: getCookie(AUTH_REFRESH_TOKEN)}});
            } else {
                setAuthStatus(false);
            }
        }

        // start expiration watcher
        if (fetchUserAuthState.matches('success')) {
            const refTokenString = getCookie(AUTH_REFRESH_TOKEN);
            if (refTokenString !== undefined && refTokenString !== null) {
                const refToken: TokenPayload = JSON.parse(refTokenString);
                logger.log("Starting token watchExpiration. Days until exp:", Math.floor(refToken.expiration / (24 * 60 * 60 * 1000)));
                watchExpiration(refToken.expiration, refToken);
            }

            function watchExpiration(exp: number, refToken: TokenPayload) {
                if (watcher.current !== null) {
                    clearTimeout(watcher.current);
                }
                watcher.current = setTimeout(() => {
                    sendToUserAuthMachine({type: 'RETRY', payload: {refreshToken: refToken}});
                    // 10s buffer before actual expiration.
                }, exp - 10000);
            }
        }
    }, [fetchUserAuthState, sendToUserAuthMachine])

    return {authStatus, setAuthStatus, logout};
}

export { useUserAuth };
