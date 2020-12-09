const db = require('../../../config/db')

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
}