import { Repo } from "@/types/Repo/Repo";

interface IUserRepo extends Repo<UserProps> {
    getUserById(userId: string): Promise<UserProps>;
    getUserByToken(token: string): Promise<UserProps>;
    getAllUser(): Promise<UserProps[]>;
    authUser(email: string, password: string): Promise<UserProps>;
    refreshToken(token: string): Promise<{ token: string }>;
}

export type { IUserRepo };
