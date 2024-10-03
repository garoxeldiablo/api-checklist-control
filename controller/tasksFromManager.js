import { query } from "../database/config.js";

// Controller untuk menambahkan tugas ke dalam checklist
export const addTask = async (req, res) => {
    const { name, category, description, priority } = req.body;

    // Validasi input
    if (!name || !category || !description || !priority) {
        return res.status(400).json({ error: 'name, and description are required.' });
    }

    const insertAddTaskQuery = `
        INSERT INTO tasks (name, category, description, priority) VALUES (?, ?, ?, ?)
    `;

    try {
        // Query untuk menambahkan data ke tabel tasks
        await query(insertAddTaskQuery,[name, category, description, priority]);

        // Jika berhasil, kirimkan respons sukses
        return res.status(201).json({msg: "tasks added !"});
    } catch (error) {
        console.error('Error adding task:', error);
        return res.status(500).json({ error: 'Failed to add task' });
    }
};