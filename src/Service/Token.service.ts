import Token, { IToken } from '~/App/Model/Token';

class TokenService {
    // add token
    async addToken(token: IToken['token'], user_id: IToken['user_id']) {
        try {
            const newToken = new Token({
                user_id,
                token,
            });
            await newToken.save();
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}
export default new TokenService();
