type MockData = UserProps & {
    MOCK_password: string;
}

const mockUser: MockData[] = [{
    userId: "U1",
    firstname: 'Max',
    lastname: 'Mustermann',
    MOCK_password: '$2b$10$RozTlWGXFA1pL8K3ey0rguKEifNgOMzZIdn2xQU9UEMsXLyg73Oq2', // password123#
    email: 'max@mail.de',
    token: "Bearer ABCD1234",
    refreshToken: "Bearer EFGH5678",
    expiration: 1
}];

export { mockUser };
