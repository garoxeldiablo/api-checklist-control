import { query } from "../database/config.js";

export const getTask = async(req, res) =>{
    const queryGet = `SELECT * FROM tasks ORDER BY category ASC`

    try {
        // Query untuk menambahkan data ke tabel tasks
        const task = await query(queryGet);

        const tasks = task;
        res.status(201).json({tasks})

    } catch (error) {
        console.error('Error get task:', error);
        return res.status(500).json({ error: 'internal server error' });
    }
}