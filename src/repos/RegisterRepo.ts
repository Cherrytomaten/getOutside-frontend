import { Repo } from "@/types/Repo/Repo";
import { RegisterUserProps } from "@/types/User/RegisterUserProps";
import axios from "axios";
import { FetchRegisterDataResponse } from "@/types/User/FetchRegisterDataResponse";
import { FetchUserAuthErrorResponseProps } from "@/types/Auth/FetchUserAuthErrorResponseProps";

class RegisterRepo implements Repo<RegisterUserProps> {
    /**
     * Repo function to register a new user.
     * @param user userdata for the new user object that should be registered.
     * @returns simple data object with username & email of the new user.
     */
    public async create(user: RegisterUserProps): Promise<any> {
        return await axios.post('/api/register', {
            user
        })
            .then((res: FetchRegisterDataResponse) => {
                return Promise.resolve(res.data);
            })
            .catch((err: FetchUserAuthErrorResponseProps) => {
                return Promise.reject(err.response.data);
            })
    }

    delete(t: RegisterUserProps): Promise<any> {
        return Promise.resolve(undefined);
    }

    exists(t: RegisterUserProps): Promise<boolean> {
        return Promise.resolve(false);
    }
}

export { RegisterRepo };
