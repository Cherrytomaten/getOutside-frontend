import { IUserRepo } from "@/types/Repo/IUserRepo";
import axios from "axios";
import { FetchUserDataResponseProps } from "@/types/Auth/FetchUserDataResponseProps";
import { FetchUserDataErrorProps } from "@/types/Auth/FetchUserDataErrorProps";
import { setCookie } from "@/util/cookieManager";
import { AUTH_REFRESH_TOKEN, AUTH_TOKEN } from "@/types/constants";

class UserRepo implements IUserRepo {
    /**
     * Repo function to log in an existing user and get their tokens. Also save the default & refresh token as cookies
     * @param email of the dedicated user account.
     * @param password of the dedicated user account.
     * @returns the complete userdata with username etc. aswell as a JWT, refresh token & expiration date
     */
    public async authUser(email: string, password: string): Promise<UserProps> {
        return await axios.post('/api/user/login', {
            email: email,
            password: password
        })
            .then((res: FetchUserDataResponseProps) => {
                setCookie(AUTH_TOKEN, res.data.token, res.data.expiration);
                setCookie(AUTH_REFRESH_TOKEN, res.data.refreshToken, 24);
                return Promise.resolve(res.data);
            })
            .catch((err: FetchUserDataErrorProps) => {
                return Promise.reject(err.response.data);
            })
    }

    public async getUserByToken(token: string): Promise<UserProps> {
        console.log("res")
        throw new Error("Method not implemented.");
    }

    delete(t: UserProps): Promise<any> {
        return Promise.resolve(undefined);
    }

    exists(t: UserProps): Promise<boolean> {
        return Promise.resolve(false);
    }

    getAllUser(): Promise<UserProps[]> {
        return Promise.resolve([]);
    }

    getUserById(userId: string): Promise<UserProps> {
        return Promise.resolve({} as UserProps);
    }

    refreshToken(token: string): Promise<{ token: string }> {
        return Promise.resolve({token: ""});
    }

    save(t: UserProps): Promise<any> {
        return Promise.resolve(undefined);
    }

}

export { UserRepo };
