import { Context, createContext, ReactNode, useContext } from "react";
import { useMachine } from "@xstate/react";
import { fetchAuthUserMachine } from "@/machines/authUser";
import { UserRepo } from "@/repos/UserRepo";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";
import { BaseActionObject, ResolveTypegenMeta, ServiceMap, State, TypegenDisabled } from "xstate";
import { AuthContext, AuthEvent, AuthTypestate } from "@/types/Auth";

type LayoutProp = {
    children: ReactNode,
}

type AuthContextProps = {
    fetchUserAuthState: State<AuthContext, AuthEvent, any, AuthTypestate, ResolveTypegenMeta<TypegenDisabled, AuthEvent, BaseActionObject, ServiceMap>> | null,
    sendToUserAuthMachine: (arg0: any) => any,
    UserRepoClass: UserRepo,
}

const AuthContextDefault: AuthContextProps = {
    fetchUserAuthState: null,
    sendToUserAuthMachine: () => {},
    UserRepoClass: new UserRepo()
}

const AuthContextInstance = createContext(AuthContextDefault);

function AuthProvider({ children }: LayoutProp) {
    const UserRepoClass = new UserRepo();
    const [fetchUserAuthState, sendToUserAuthMachine] = useMachine(fetchAuthUserMachine, {
        actions: {
            fetchUserAuth: (ctx, event: { type: 'FETCH_AUTH_USER', payload: { email: string, password: string } }) => {
                UserRepoClass.authUser(event.payload.email, event.payload.password)
                    .then(
                        (res: UserProps) => {
                            console.log("User got authenticated successfully!");
                            sendToUserAuthMachine({ type: 'RESOLVE_AUTH', user: res, err: null });
                    },
                        (err: FetchServerErrorResponse) => {
                            console.log("User auth failed:", err.errors.message);
                            sendToUserAuthMachine({ type: 'REJECT_AUTH', err: err });
                        }
                    )
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
