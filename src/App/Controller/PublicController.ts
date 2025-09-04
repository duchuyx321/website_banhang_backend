import { RouteHandler } from '~/interfaces/express';

class PublicController {
    // [GET] --/
    getListProductHome: RouteHandler = async (req, res) => {
        try {
            return res.status(200).json('succces full');
        } catch (error) {
            const err = error as Error;
            console.log(err);
            return res.status(500).json({ error: err.message });
        }
    };
}

export default new PublicController();
