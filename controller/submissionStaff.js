import { query } from "../database/config.js";
import { isWithinValidLocation } from "./gymLocation.js";

// Controller untuk menangani submit tugas
export const submitTask = async (req, res) => {
    const { task_id, staff_id, latitude, longitude } = req.body;

    // Validasi input
    if (!task_id || !staff_id || !latitude || !longitude) {
        return res.status(400).json({ error: 'Task ID, Staff ID, latitude, and longitude are required.' });
    }

    try {
        // Cek apakah lokasi submit dalam area yang valid
        const isValidLocation = isWithinValidLocation(latitude, longitude);

        // Simpan data ke tabel submissions
        const result = await query(
            `INSERT INTO submissions (task_id, staff_id, latitude, longitude, is_valid_location) VALUES (?, ?, ?, ?, ?)`,
            [task_id, staff_id, latitude, longitude, isValidLocation]
        );

        // Kirimkan respons sukses
        return res.status(201).json({
            message: 'Task submitted successfully',
            submission: {
                id: result.insertId,
                task_id,
                staff_id,
                latitude,
                longitude,
                is_valid_location: isValidLocation,
            },
        });
    } catch (error) {
        console.error('Error submitting task:', error);
        return res.status(500).json({ error: 'Failed to submit task' });
    }
};
