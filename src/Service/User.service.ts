import User from '~/App/Model/User';
class UserService {
    // find user method role
    async findUser(user_id: string, role?: string) {
        try {
            const user = await User.find({ _id: user_id, role: role }).select(
                '',
            );
            if (user) {
                return { status: 404, error: 'user does not exist!' };
            }
            return { status: 200, message: 'user exists!' };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}

export default new UserService();
