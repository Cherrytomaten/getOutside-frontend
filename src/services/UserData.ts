import axios, { AxiosResponse } from "axios/index";
import { WrapperServerErrorResponse } from "@/types/Server/WrapperServerErrorResponse";
import { PersonalUserDataProps } from "@/types/User/PersonalUserDataProps";
import { ChangePasswordProps } from "@/types/User/ChangePasswordProps";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";

type PersonalDataServerResponseProps = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
};

class UserData {
  async updatePersonalData(profileData: PersonalUserDataProps): Promise<PersonalUserDataProps> {
    return await axios.put('/api/user/update-personal-data', {
        first_name: profileData.fname,
        last_name: profileData.lname,
        username: profileData.username,
        email: profileData.email,
      })
      .then((res: AxiosResponse<PersonalDataServerResponseProps>) => {
        return Promise.resolve({
          fname: res.data.first_name,
          lname: res.data.last_name,
          username: res.data.username,
          email: res.data.email
        });
      })
      .catch((err: WrapperServerErrorResponse) => {
        return Promise.reject(err.response.data);
      });
  }

  async updateUserPassword(passwordData: ChangePasswordProps): Promise<void | FetchServerErrorResponse> {
    return await axios.put('/api/user/update-password', {
        password: passwordData.cPassword,
        new_password: passwordData.nPassword,
        new_password2: passwordData.n2Password,
      })
      .then((_res: any) => {
        return Promise.resolve();
      })
      .catch((err: WrapperServerErrorResponse) => {
        return Promise.reject(err.response.data);
      });
  }
}

export const userDataService = new UserData();
