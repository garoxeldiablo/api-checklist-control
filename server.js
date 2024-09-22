import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./database/config.js";
import router from "./route/router.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT

try {
    await db.getConnection();
    console.log('Database terhubung...');
} catch (error) {
    console.log('batal terhubung',error);
}


app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(PORT, ()=> console.log(`Server running at port ${PORT}`));