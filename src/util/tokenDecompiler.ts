import { Logger } from "@/util/logger";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";

type RawTokenPayload = {
    token_type: string;
    exp: string;
    iat: string;
    jti: string;
    user_id: string;
}

function tokenDecompiler(token: string): TokenPayload | null {
    const payload: string[] = token.split('.');

    // Check wrong format
    if (payload.length !== 3) {
        return null;
    }

    const buffer = new Buffer(payload[1], 'base64');
    const tokenData: RawTokenPayload = JSON.parse(buffer.toString('ascii'));

    Logger.log("decompiled token:", tokenData);
    return { type: tokenData.token_type, token: tokenData.jti, expiration: Number(tokenData.exp), userId: tokenData.user_id };
}

export { tokenDecompiler }
