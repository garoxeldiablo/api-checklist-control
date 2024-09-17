import { query } from "../database/config.js";

// Controller untuk menambahkan tugas ke dalam checklist
export const addTask = async (req, res) => {
    const { checklist_id, name, description } = req.body;

    // Validasi input
    if (!checklist_id || !name || !description) {
        return res.status(400).json({ error: 'Checklist ID, name, and description are required.' });
    }

    const insertAddTaskQuery = `
        INSERT INTO tasks (checklist_id, name, description) VALUES (?, ?, ?)
    `;

    try {
        // Query untuk menambahkan data ke tabel tasks
        await query(insertAddTaskQuery,[checklist_id, name, description]);

        // Jika berhasil, kirimkan respons sukses
        return res.status(201).json({msg: "tasks added !"});
    } catch (error) {
        console.error('Error adding task:', error);
        return res.status(500).json({ error: 'Failed to add task' });
    }
};
