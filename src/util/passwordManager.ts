// Not for frontend use!
const bcrypt = require('bcrypt');

async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10)
        .then((hash: string) => {
            return hash;
        })
}

async function isSamePassword(rawPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(rawPassword, hashedPassword)
        .then((res: boolean) => {
            return res;
        })
}

export { hashPassword, isSamePassword };
