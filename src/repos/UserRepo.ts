import { IUserAuthRepo } from "@/types/Repo/IUserAuthRepo";
import axios from "axios";
import { FetchUserAuthResponseProps } from "@/types/Auth/FetchUserAuthResponseProps";
import { FetchUserAuthErrorResponseProps } from "@/types/Auth/FetchUserAuthErrorResponseProps";
import { deleteCookies, setCookies } from "@/util/cookieManager";
import { AUTH_REFRESH_TOKEN, AUTH_TOKEN } from "@/types/constants";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";
import { UserAuthProps } from "@/types/User";


/**
 * This class offers a general interface to access different functions from every file where this class
 * got instantiated. The functions are related to user authentication.
 */
class UserAuthRepo implements IUserAuthRepo {
  /**
   * Repo function to log in an existing user and get their tokens. Also save the default & refresh token as cookies
   * @param username of the dedicated user account.
   * @param password of the dedicated user account.
   * @returns the user auth data containing userId, access & refresh token
   */
  public async authUser(
    username: string,
    password: string
  ): Promise<UserAuthProps> {
    return await axios
      .post('/api/auth/login', {
        username: username,
        password: password,
      })
      .then((res: FetchUserAuthResponseProps) => {
        const _res = res;
        _res.data.refresh.expiration = 3000;
        console.log(_res.data)
        setCookies([
          {
            name: AUTH_TOKEN,
            value: res.data.access,
            //exp: res.data.access.expiration,
            exp: 3000
          },
          {
            name: AUTH_REFRESH_TOKEN,
            value: res.data.refresh,
            exp: res.data.refresh.expiration,
          },
        ]);
        return Promise.resolve(_res.data);
      })
      .catch((err: FetchUserAuthErrorResponseProps) => {
        return Promise.reject(err.response.data);
      });
  }

  /**
   * Repo function to log in an existing user based on the cookie token that was found
   * @returns the complete userdata with username etc. aswell as a JWT, refresh token & expiration date
   */
  public async getUserByToken(): Promise<UserAuthProps> {
    return await axios.get('/api/auth/by-token')
      .then((res: FetchUserAuthResponseProps) => {
        setCookies([
          {
            name: AUTH_TOKEN,
            value: res.data.access,
            exp: res.data.access.expiration,
          },
          {
            name: AUTH_REFRESH_TOKEN,
            value: res.data.refresh,
            exp: res.data.refresh.expiration,
          },
        ]);
        return Promise.resolve(res.data);
      })
      .catch((err: FetchUserAuthErrorResponseProps) => {
        return Promise.reject(err.response.data);
      });
  }

  /**
   * Repo function to refresh the existing token with its refresh token.
   * @param refToken the refresh token queried from the user cookies
   * @returns the new token payload with a new token, refreshToken & exp. time
   */
  public async refreshToken(refToken: TokenPayload): Promise<TokenPayload> {
    return await axios
      .post('/api/auth/refresh-token', {
        refToken: refToken
      })
      .then((res: { data: TokenPayload }) => {
        setCookies([
          {
            name: AUTH_TOKEN,
            value: res.data.token,
            exp: res.data.expiration,
          },
          {
            name: AUTH_REFRESH_TOKEN,
            value: res.data.refreshToken,
            exp: 24,
          },
        ]);
        return Promise.resolve(res.data);
      })
      .catch((err: FetchUserAuthErrorResponseProps) => {
        deleteCookies([AUTH_TOKEN, AUTH_REFRESH_TOKEN]);
        return Promise.reject(err.response.data);
      });
  }

  /**
   * Repo function to handle the deletion of the cookied tokens from a user
   */
  public logout() {
    deleteCookies([AUTH_TOKEN, AUTH_REFRESH_TOKEN]);
  }
}

export { UserAuthRepo };
