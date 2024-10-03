import { query } from "../database/config.js";
import { isWithinValidLocation } from "./gymLocation.js";

// Create submission with validation for id_user existence
export const createSubmission = async (req, res) => {
  const { id_user } = req.params; // Mendapatkan id_user dari req.params
  const { latitude, longitude } = req.body;


  try {
    // Query untuk memeriksa apakah id_user ada di tabel users
    const userCheckQuery = `
    SELECT * FROM users WHERE id = ?;
    `;

    // Cek apakah user ada
    const userResults = await query(userCheckQuery, [id_user]);

    // Jika user tidak ditemukan, kirim response 404
    if (userResults.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Validasi apakah lokasi submit berada dalam area yang valid
    const valid_location = isWithinValidLocation(latitude, longitude);
    
    if (!valid_location) {
      // Jika lokasi tidak valid, kirim response error
      return res.status(400).json({ message: 'Lokasi di luar area yang diizinkan' });
    }

    // Query untuk menghitung task_selesai dan task_belumselesai
    const taskCountQuery = `
      SELECT 
        COUNT(CASE WHEN is_mandatory = 1 THEN 1 END) AS task_selesai,
        COUNT(CASE WHEN is_mandatory = 0 THEN 1 END) AS task_belum_selesai
      FROM tasks;
    `;

    const taskCountResults = await query(taskCountQuery);

    const task_selesai = taskCountResults[0].task_selesai;
    const task_belumselesai = taskCountResults[0].task_belum_selesai;

    // Query untuk menyimpan data submission
    const insertQuery = `
      INSERT INTO submissions (id_user, task_selesai, task_belumselesai, lattitude, longitude, valid_location)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const insertResult = await query(insertQuery, [id_user, task_selesai, task_belumselesai, latitude, longitude, valid_location]);

    // Mengirimkan response berhasil
    res.status(201).json({ message: 'Submission berhasil dibuat', submissionId: insertResult });

  } catch (error) {
    // Error handling
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
