import { IUserAuthRepo } from "@/types/Repo/IUserAuthRepo";
import axios from "axios";
import { FetchUserDataResponseProps } from "@/types/Auth/FetchUserDataResponseProps";
import { FetchUserDataErrorProps } from "@/types/Auth/FetchUserDataErrorProps";
import { deleteCookies, setCookies } from "@/util/cookieManager";
import { AUTH_REFRESH_TOKEN, AUTH_TOKEN } from "@/types/constants";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";


/**
 * This class offers a general interface to access different functions from every file where this class
 * got instantiated. The functions are related to user authentication.
 */
class UserAuthRepo implements IUserAuthRepo {
    /**
     * Repo function to log in an existing user and get their tokens. Also save the default & refresh token as cookies
     * @param email of the dedicated user account.
     * @param password of the dedicated user account.
     * @returns the complete userdata with username etc. aswell as a JWT, refresh token & expiration date
     */
    public async authUser(email: string, password: string): Promise<UserProps> {
        return await axios.post('/api/auth/login', {
            email: email,
            password: password
        })
            .then((res: FetchUserDataResponseProps) => {
                setCookies([
                    { name: AUTH_TOKEN, value: res.data.token, expHrs: res.data.expiration },
                    { name: AUTH_REFRESH_TOKEN, value: res.data.refreshToken, expHrs: 24 }
                ]);
                return Promise.resolve(res.data);
            })
            .catch((err: FetchUserDataErrorProps) => {
                return Promise.reject(err.response.data);
            })
    }

    /**
     * Repo function to log in an existing user based on the cookie token that was found
     * @param token from the stored cookies
     * @returns the complete userdata with username etc. aswell as a JWT, refresh token & expiration date
     */
    public async getUserByToken(token: string): Promise<UserProps> {
        return await axios.get('/api/auth/by-token', {
            params: { token: token }
        })
            .then((res: FetchUserDataResponseProps) => {
                setCookies([
                    { name: AUTH_TOKEN, value: res.data.token, expHrs: res.data.expiration },
                    { name: AUTH_REFRESH_TOKEN, value: res.data.refreshToken, expHrs: 24 }
                ]);
                return Promise.resolve(res.data);
            })
            .catch((err: FetchUserDataErrorProps) => {
                return Promise.reject(err.response.data);
            })
    }

    /**
     * Repo function to refresh the existing token with its refresh token.
     * @param refToken the refresh token queried from the user cookies
     * @returns the new token payload with a new token, refreshToken & exp. time
     */
    public async refreshToken(refToken: string): Promise<TokenPayload> {
        return await axios.get('/api/auth/refresh-token', {
            params: { refToken: refToken }
        })
            .then((res: { data: TokenPayload }) => {
                setCookies([
                    { name: AUTH_TOKEN, value: res.data.token, expHrs: res.data.expiration },
                    { name: AUTH_REFRESH_TOKEN, value: res.data.refreshToken, expHrs: 24 }
                ]);
                return Promise.resolve(res.data);
        })
            .catch((err: FetchUserDataErrorProps) => {
                deleteCookies([AUTH_TOKEN, AUTH_REFRESH_TOKEN]);
                return Promise.reject(err.response.data);
            })
    }

    /**
     * Repo function to handle the deletion of the cookied tokens from a user
     */
    public logout() {
        deleteCookies([AUTH_TOKEN, AUTH_REFRESH_TOKEN]);
    }
}

export { UserAuthRepo };
