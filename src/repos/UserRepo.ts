import { IUserAuthRepo } from "@/types/Repo/IUserAuthRepo";
import axios from "axios";
import { FetchUserAuthResponseProps } from "@/types/Auth/FetchUserAuthResponseProps";
import { FetchUserAuthErrorResponseProps } from "@/types/Auth/FetchUserAuthErrorResponseProps";
import { deleteCookies, getCookie, setCookies } from "@/util/cookieManager";
import { ACTIVE_CATEGORIES, AUTH_REFRESH_TOKEN, AUTH_TOKEN, RADIUS_FILTER } from "@/types/constants";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";
import { UserAuthProps } from "@/types/User";
import { Logger } from "@/util/logger";


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
   * Repo function to log in an existing user based on the cookie token that was found
   * @returns the complete userdata with username etc. aswell as a JWT, refresh token & expiration date
   */
  public async getUserByToken(): Promise<UserAuthProps> {
    return await axios
      .get('/api/auth/by-token')
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

  public async getUserData(authAccessToken: any): Promise<any> {
    console.log('authAccessToken', authAccessToken);
    //  const authToken: TokenPayload = JSON.parse(authAccessToken);
    //  console.log('authToken', authToken);
    // console.log('authToken', authToken); n
    return await axios
      .get('https://cherrytomaten.herokuapp.com/authentication/user/' , {
        headers: {
            'Authorization': 'Bearer ' + authAccessToken.token
        }
    })
      .then((res: FetchUserAuthResponseProps) => {

        return Promise.resolve(res);
      })
      .catch((err: FetchUserAuthErrorResponseProps) => {
        return Promise.reject(err);
      });
  }

  /**
   * Repo function to refresh the existing token with its refresh token.
   * @param refToken the refresh token queried from the user cookies
   * @returns the new token payload with a new token, refreshToken & exp. time
   */
  public async refreshToken(refToken: TokenPayload): Promise<UserAuthProps> {
    return await axios
      .post('/api/auth/refresh-token', {
        refreshToken: refToken,
      })
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
        deleteCookies([AUTH_TOKEN, AUTH_REFRESH_TOKEN]);
        return Promise.reject(err.response.data);
      });
  }

  /**
   * Repo function to handle the deletion of the cookied tokens from a user
   */
  public logout() {
    const refToken = getCookie(AUTH_REFRESH_TOKEN);
    deleteCookies([
      AUTH_TOKEN,
      AUTH_REFRESH_TOKEN,
      ACTIVE_CATEGORIES,
      RADIUS_FILTER,
    ]);

    axios
      .post('/api/auth/revoke', {
        refreshToken: refToken,
      })
      .then((_res) => {
        Logger.log('Refresh token revoked successfully.');
      })
      .catch((_err: FetchUserAuthErrorResponseProps) => {
        Logger.log(
          'Error while trying to revoke token:',
          _err.response.data.message
        );
      });
  }
}

export { UserAuthRepo };
