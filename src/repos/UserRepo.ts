import { IUserAuthRepo } from "@/types/Repo/IUserAuthRepo";
import axios from "axios";
import { FetchUserAuthResponseProps } from "@/types/Auth/FetchUserAuthResponseProps";
import { deleteCookies, getCookie, setCookies } from "@/util/cookieManager";
import { ACTIVE_CATEGORIES, AUTH_REFRESH_TOKEN, AUTH_TOKEN, RADIUS_FILTER } from "@/types/constants";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";
import { UserAuthProps } from "@/types/User";
import { logger } from "@/util/logger";
import { WrapperServerErrorResponse } from "@/types/Server/WrapperServerErrorResponse";
import { ResetPasswordProps } from "@/types/User/ResetPasswordProps";
import { UserDataProps } from "@/types/User/UserDataProps";


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
      .catch((err: WrapperServerErrorResponse) => {
        return Promise.reject(err.response.data);
      });
  }

  /**
   * Repo function to fetch detailed information about the currently logged-in user.
   * @returns detailed user information
   */
  public async getUserData(): Promise<UserDataProps> {
    return await axios.get('/api/get-data/')
        .then((res: { data: UserDataProps }) => {
          return Promise.resolve(res.data);
        })
        .catch((err: WrapperServerErrorResponse) => {
          return Promise.reject(err.response.data);
        })
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
      .catch((err: WrapperServerErrorResponse) => {
        return Promise.reject(err.response.data);
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
        refreshToken: refToken
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
      .catch((err: WrapperServerErrorResponse) => {
        deleteCookies([AUTH_TOKEN, AUTH_REFRESH_TOKEN]);
        return Promise.reject(err.response.data);
      });
  }

  /**
   * Repo function to send an email, to reset the user's password.
   * @param email email that belongs to the users account
   * @returns either void on success or an error message.
   */
  public async forgotPassword(email: string): Promise<void | WrapperServerErrorResponse> {
    return await axios.post('/api/user/forgot-password', {
      email: email
    })
        .then((_res) => {
          return Promise.resolve();
        })
        .catch((err: WrapperServerErrorResponse) => {
          return Promise.reject(err.response.data);
        })
  }

  /**
   * Repo function to change a users password to the newly provided password.
   * @param user_id id of the user
   * @param user_mail email of the user
   * @param confirmation_token generated confirmation token for the user
   * @param password new password string
   * @param password2 new password string confirmation (identical duplicate)
   * @returns either void on success or an error message.
   */
  public async resetPassword({ user_id, user_mail, confirmation_token, password, password2 }: ResetPasswordProps): Promise<void | WrapperServerErrorResponse> {
    return await axios.put('/api/user/reset-password', {
      user_id: user_id,
      user_mail: user_mail,
      confirmation_token: confirmation_token,
      password: password,
      password2: password2
    })
        .then((_res) => {
          return Promise.resolve();
        })
        .catch((err: WrapperServerErrorResponse) => {
          return Promise.reject(err.response.data);
        })
  }

  /**
   * Repo function to handle the deletion of the cookied tokens from a user
   */
  public logout() {
    const refToken = getCookie(AUTH_REFRESH_TOKEN);
    deleteCookies([AUTH_TOKEN, AUTH_REFRESH_TOKEN, ACTIVE_CATEGORIES, RADIUS_FILTER]);

    axios.post('/api/auth/revoke', {
      refreshToken: refToken
    })
        .then((_res) => {
          logger.log('Refresh token revoked successfully.');
        })
        .catch((_err: WrapperServerErrorResponse) => {
          logger.log('Error while trying to revoke token:', _err.response.data.message);
        })
  }
}

export { UserAuthRepo };
