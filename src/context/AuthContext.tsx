import { createContext, ReactNode, useContext } from "react";
import { useMachine } from "@xstate/react";
import { fetchAuthUserMachine } from "@/machines/authUser";
import { UserAuthRepo } from "@/repos/UserRepo";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";
import { BaseActionObject, ResolveTypegenMeta, ServiceMap, State, TypegenDisabled } from "xstate";
import { AuthContext, AuthEvent, AuthTypestate } from "@/types/Auth";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";
import { mockUser } from "@/simulation/userdataSim";

type LayoutProp = {
    children: ReactNode,
}

type AuthStateMachine = State<AuthContext, AuthEvent, any, AuthTypestate, ResolveTypegenMeta<TypegenDisabled, AuthEvent, BaseActionObject, ServiceMap>>;

type AuthContextProps = {
    fetchUserAuthState: AuthStateMachine,
    sendToUserAuthMachine: (arg0: any) => any,
    UserRepoClass: UserAuthRepo,
}

const AuthContextDefault: AuthContextProps = {
    fetchUserAuthState: null as unknown as AuthStateMachine,
    sendToUserAuthMachine: () => {},
    UserRepoClass: new UserAuthRepo()
}

const AuthContextInstance = createContext(AuthContextDefault);

function AuthProvider({children}: LayoutProp) {
    const UserRepoClass = new UserAuthRepo();
    const [fetchUserAuthState, sendToUserAuthMachine] = useMachine(fetchAuthUserMachine, {
        actions: {
            fetchUserAuth: (ctx, event: { type: 'FETCH_AUTH_USER', payload: { email: string, password: string, token?: string } }) => {
                // check if code should query for existing token first and if found, use token to get userdata.
                if (event.payload.token) {
                    console.log("query userdata with token.");
                    UserRepoClass.getUserByToken(event.payload.token)
                        .then(
                            (res: UserProps) => {
                                console.log("User found with existing token.");
                                sendToUserAuthMachine({ type: 'RESOLVE_AUTH', user: res, err: null });
                            },
                            (err: FetchServerErrorResponse) => {
                                console.log("User auth with token failed:", err.errors.message);
                                sendToUserAuthMachine({ type: 'REJECT_AUTH', err: null, attRef: false });
                            }
                        )
                    return;
                }

                UserRepoClass.authUser(event.payload.email, event.payload.password)
                    .then(
                        (res: UserProps) => {
                            console.log("User got authenticated successfully!");
                            sendToUserAuthMachine({ type: 'RESOLVE_AUTH', user: res, err: null });
                        },
                        (err: FetchServerErrorResponse) => {
                            console.log("User auth failed:", err);
                            sendToUserAuthMachine({ type: 'REJECT_AUTH', err: err, attRef: false });
                        }
                    )
            },

            refreshToken: (ctx, event: { type: 'RETRY', payload: { refreshToken: string } }) => {
                console.log("trying to refresh token...");
                UserRepoClass.refreshToken(event.payload.refreshToken)
                    .then(
                        (res: TokenPayload) => {
                            console.log("token was refreshed successfully!", res.token);
                            sendToUserAuthMachine({ type: 'RESOLVE_AUTH', user: mockUser[0], err: null });
                        },
                        (err: FetchServerErrorResponse) => {
                            console.log("err while trying to refresh token:", err.errors.message);
                            sendToUserAuthMachine({ type: 'REJECT_AUTH', err: null, attRef: true });
                        }
                    )
            },

            deleteCookies: (ctx, event: { type: 'LOGOUT' }) => {
                console.log("loging out...");
                UserRepoClass.logout();
                sendToUserAuthMachine({ type: 'IDLE' });
            }
        }
    });

    const value = {
        fetchUserAuthState,
        sendToUserAuthMachine,
        UserRepoClass
    }

    return (
        <AuthContextInstance.Provider value={value}>{children}</AuthContextInstance.Provider>
    );
}

function useAuth() {
    return useContext(AuthContextInstance);
}

export { AuthProvider, useAuth };
