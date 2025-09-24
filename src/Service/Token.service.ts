import ms, { StringValue } from 'ms';
import Token, { IToken } from '~/App/Model/Token';

class TokenService {
    // clean token
    cleanToken(token: string) {
        if (!token) {
            throw new Error('not token!');
        }
        return token.startsWith('Bearer ')
            ? token.slice(7).trim()
            : token.trim();
    }
    // add token
    async addToken(
        token: IToken['token'],
        user_id: IToken['user_id'] | string,
        expiresAt: StringValue = '7d',
    ) {
        try {
            const endTimeToken = new Date(Date.now() + ms(expiresAt));
            const splitToken = this.cleanToken(token);
            const newToken = new Token({
                user_id,
                token: splitToken,
                expiresAt: endTimeToken,
            });
            await newToken.save();
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
    /// chỉ cho 1 token / user
    async saveSingleToken(
        user_id: string,
        token: string,
        expiresAt: StringValue = '7d',
    ) {
        try {
            const endTimeToken = new Date(Date.now() + ms(expiresAt));
            const splitToken = this.cleanToken(token);

            return Token.findOneAndUpdate(
                { user_id },
                { token: splitToken, expiresAt: endTimeToken },
                { upsert: true, new: true },
            );
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
    // find Token
    async findToken(token: string, user_id: string) {
        try {
            const now = Date.now();
            const splitToken = this.cleanToken(token);
            const checkToken = await Token.findOne({
                token: splitToken,
                user_id,
                expiresAt: { $gt: now },
            }).select('');
            if (!checkToken) {
                return {
                    status: 404,
                    error: 'Your login session has expired!',
                };
            }
            return { status: 200, message: 'token existence!' };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
    async deleteToken(token: string, user_id: string) {
        try {
            // clean token
            const splitToken = this.cleanToken(token);
            //  xóa token
            await Token.deleteOne({ token: splitToken, user_id });
            return { status: 200, message: 'delete token successful!' };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}
export default new TokenService();
