import { query } from "../database/config.js"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const getUsers = async(req,res) => {
    try {
        const result = await query("SELECT id, username, role FROM users");
        return res.status(200).json({data: result});
    } catch (error) {
        console.log(error);
    }
}

export const register = async (req, res) => {
    const { username, password, confPassword, role } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password and Confirm Password do not match" });

    const salt = await bcryptjs.genSalt();
    const hashPassword = await bcryptjs.hash(password, salt);

    const insertUserQuery = `
        INSERT INTO users (username, password, role)
        VALUES (?, ?, ?);
    `;

    try {
        await query(insertUserQuery, [username, hashPassword, role]);
        res.json({ msg: "Registration Successful" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;

    const findUserQuery = `
        SELECT * FROM users WHERE username = ?;
    `;

    const updateUserTokenQuery = `
        UPDATE users SET refresh_token = ? WHERE id = ?;
    `;

    try {
        const [user] = await query(findUserQuery, [username]);

        if (!user) return res.status(404).json({ msg: "user not found" });

        const match = await bcryptjs.compare(password, user.password);
        if (!match) return res.status(400).json({ msg: "Wrong Password" });

        const userId = user.id;
        const name = user.username;
        const roles = user.role;

        // const imgBase64 = imgU ? imgU.toString('base64') : '';

        const accessToken = jwt.sign({ userId, name, roles }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });

        const refreshToken = jwt.sign({ userId, name, roles }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        await query(updateUserTokenQuery, [refreshToken, userId]);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ accessToken, username, roles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const findUserByTokenQuery = `
        SELECT * FROM users WHERE refresh_token = ?;
    `;

    const [user] = await query(findUserByTokenQuery, [refreshToken]);

    if (!user) return res.sendStatus(204);

    const userId = user.id;

    const updateUserTokenQuery = `
        UPDATE users SET refresh_token = NULL WHERE id = ?;
    `;

    try {
        await query(updateUserTokenQuery, [userId]);
        res.clearCookie('refreshToken');
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};