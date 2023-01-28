import { Repo } from '@/types/Repo/Repo';
import { RegisterUserProps } from '@/types/User/RegisterUserProps';
import axios from 'axios';
import { FetchRegisterDataResponse } from '@/types/User/FetchRegisterDataResponse';
import { WrapperServerErrorResponse } from '@/types/Server/WrapperServerErrorResponse';
import { FetchServerErrorResponse } from '@/types/Server/FetchServerErrorResponse';
import { ActivateRegisteredUserProps } from '@/types/User/ActivateRegisteredUserProps';

class RegisterRepo implements Repo<RegisterUserProps> {
  /**
   * Repo function to register a new user.
   * @param user userdata for the new user object that should be registered.
   * @returns simple data object with username & email of the new user.
   */
  public async create(user: RegisterUserProps): Promise<any> {
    return await axios
      .post('/api/register', {
        user,
      })
      .then((res: FetchRegisterDataResponse) => {
        return Promise.resolve(res.data);
      })
      .catch((err: WrapperServerErrorResponse) => {
        return Promise.reject(err.response.data);
      });
  }

  /**
   * Repo function to send a verification email to an existing email from a user account.
   * @param email that exists for a registered user.
   * @returns either void on success or an error message.
   */
  public async sendConfirmationEmail(email: string): Promise<void | FetchServerErrorResponse> {
    return await axios
      .post('/api/register/confirm-email', {
        email: email,
      })
      .then((_res) => {
        return Promise.resolve();
      })
      .catch((err: WrapperServerErrorResponse) => {
        return Promise.reject(err.response.data);
      });
  }

  /**
   * Repo function to activate a user account, these params are fetched from the url, that was sent by email.
   * @param user_uuid id of the user
   * @param user_mail email of the user
   * @param confirmation_token generated confirmation token for the user
   * @returns either void on success or an error message.
   */
  public async activateUser({ user_uuid, user_mail, confirmation_token }: ActivateRegisteredUserProps): Promise<void | WrapperServerErrorResponse> {
    return await axios
      .get('/api/register/activate', {
        params: {
          user_uuid: user_uuid,
          user_mail: user_mail,
          confirmation_token: confirmation_token,
        },
      })
      .then((_res) => {
        return Promise.resolve();
      })
      .catch((err: WrapperServerErrorResponse) => {
        return Promise.reject(err.response.data);
      });
  }

  delete(t: RegisterUserProps): Promise<any> {
    return Promise.resolve(undefined);
  }

  exists(t: RegisterUserProps): Promise<boolean> {
    return Promise.resolve(false);
  }
}

export const RegisterRepoClass = new RegisterRepo();
