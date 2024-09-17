import { query } from "../database/config.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);

        const findUserByTokenQuery = `
            SELECT * FROM users WHERE refresh_token = ?;
        `;

        const [user] = await query(findUserByTokenQuery, [refreshToken]);

        if (!user) return res.sendStatus(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);

            const userId = user.id;
            const name = user.name;
            const email = user.email;

            const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15s'
            });

            res.json({ accessToken });
        });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}
