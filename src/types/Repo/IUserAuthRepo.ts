interface IUserAuthRepo {
    authUser(email: string, password: string): Promise<UserProps>;
    refreshToken(token: string): Promise<{ token: string }>;
    logout(): void;
}

export type { IUserAuthRepo };
