import { query } from "../database/config.js";

// Controller untuk memperbarui kolom is_mandatory
export const updateTaskMandatoryStatus = async (req, res) => {
    const { taskId } = req.params;  // ID dari tugas yang ingin di-update

    const { isMandatory } = req.body;

    const updateTaskQuery = `UPDATE tasks SET is_mandatory = ? WHERE id = ?`

    try {
        // Query untuk memperbarui kolom is_mandatory menjadi TRUE (1)
        const result = await query(
            updateTaskQuery,[isMandatory,taskId]
        );

        // Cek apakah ada baris yang terpengaruh oleh update
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Respons sukses jika update berhasil
        return res.status(200).json({
            message: 'Task updated successfully',
        });
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ error: 'Failed to update task' });
    }
};
