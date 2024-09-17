import { query } from "../database/config.js";

export const checkLists = async(req, res) =>{
    const {checkname, description} = req.body;

    const insertChecklists = `
    INSERT INTO checklists (checkname, description) VALUES (?,?);
    `
    try{
        await query(insertChecklists,[checkname, description]);
        res.json({msg : "checklists added !"})
    } catch(error){
        console.error(error);
        res.status(500).send('Internal server error.')
    }
}