import { query } from "../database/config.js";

export const getSubmission = async(req, res) =>{
    const queryGet = `SELECT * FROM submissions`

    try {
        // Query untuk menambahkan data ke tabel tasks
        const submission = await query(queryGet);

        const submissions = submission;
        res.status(201).json({submissions})

    } catch (error) {
        console.error('Error get submissons:', error);
        res.status(500).json({ error: 'internal server error' });
    }
}