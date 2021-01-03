const db = require('../../../config/db')
const fs = require("fs")
module.exports = {
    create(data) {
        try{
            const query = `
                INSERT INTO files(
                name,
                path
                )VALUES($1, $2)
                RETURNING id
            `
            const values = [
                data.filename,
                data.path
            ]
    
            return db.query(query, values)
        }catch(error){
            throw new Error(error)
        }
    },
    createRecipeFiles({ recipe_id, file_id }) {
        try {
            const query = `
                INSERT INTO recipe_files(
                recipe_id,
                file_id
                )VALUES($1, $2)
                RETURNING id
            `
            const values = [
                recipe_id, 
                file_id
            ]
    
            return db.query(query, values)
        }catch(error){
            throw new Error(error)
        }
    },
    find(id) {
        try {
          return db.query(
            `
                SELECT *
                FROM files
                WHERE id = $1`,
            [id]
          );
        } catch (error) {
          throw new Error(error);
        }
    },
    findRecipeFiles(id){
        try {
            return db.query(`
                SELECT files.*, recipe_files.file_id AS file_id
                FROM files
                LEFT JOIN recipe_files ON (recipe_files.file_id = files.id)
                WHERE recipe_files.recipe_id = $1`, [id]
            )
        } catch (error) {
            throw new Error(error)
        }
    },
    async update(data){
        try{
            const file = (
                await db.query(`SELECT * FROM files WHERE id = $1`, [data.id])
            ).rows[0];
            
            fs.unlinkSync(file.path);
            
            const query = `
                UPDATE files SET
                    name=($1),
                    path=($2)
                WHERE id=$3
            `
            const values = [
                data.filename,
                data.path,
                data.id
            ]
    
            return db.query(query, values)
        }catch(error){
            throw new Error(error)
        }
    },
    async delete(id){
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]

            fs.unlinkSync(file.path)

            await db.query(`DELETE FROM recipe_files WHERE recipe_files.file_id = $1`, [id])
            return db.query(`DELETE FROM files WHERE id = $1`, [id])
        } catch (error) {
            throw new Error(error)
        }
    }
}