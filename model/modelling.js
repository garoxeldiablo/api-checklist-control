import db from "../database/config.js";

async function createUsersTable() {
    const connection = await db.getConnection();
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                img_user BLOB,
                refresh_token TEXT
            ) ENGINE=InnoDB;
        `;
        await connection.query(query);
    } finally {
        connection.release();
    }
}

export default createUsersTable;