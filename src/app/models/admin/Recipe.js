const db = require('../../../config/db')
const fs = require('fs')
module.exports = {
    all() {
        try{
            return db.query(`
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                ORDER BY recipes.created_at DESC
                `
            )
        }catch(error){
            throw new Error(error)
        }
    },
    create(data) {
        try{

            const query = `
                INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                prepare,
                info
                )VALUES($1, $2, $3, $4, $5)
                RETURNING id
            `
            const values = [
                data.chef_id,
                data.title,
                data.ingredients,
                data.prepare,
                data.info,
            ]
            return db.query(query, values)
        }catch(error){
            throw new Error(error)
        }

    },
    find(id){
        try{
            return db.query(`
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.id = $1
                `, [id])
        }catch(error){
            throw new Error(error)
        }
    },
    update(data){
        try{
            const query = `
                UPDATE recipes SET
                    chef_id=($1),
                    title=($2),
                    ingredients=($3),
                    prepare=($4),
                    info=($5)
                WHERE id=$6
            `
            const values = [
                data.chef_id,
                data.title,
                data.ingredients,
                data.prepare,
                data.info,
                data.id
            ]
            return db.query(query, values)
        }catch(error){
            throw new Error(error)
        }
    },
    async delete(id){
        try{
            const results = await db.query(`
                SELECT * FROM files
                INNER JOIN recipe_files ON (files.id = recipe_files.file_id)
                WHERE recipe_files.recipe_id = $1`, [id]
            )

            const removedFiles = results.rows.map(async file => {
                fs.unlinkSync(file.path)

                await db.query(`DELETE FROM recipe_files WHERE recipe_files.file_id = $1`, [file.file_id])
                await db.query(`DELETE FROM files WHERE id = $1`, [file.file_id])
            })
            return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
        }catch(error){
            throw new Error(error)
        }
    },
    chefSelectOptions(){
        try{
            return db.query(`SELECT id, name FROM chefs`)
        }catch(error){
            throw new Error(error)
        }
    },
    paginate(params){
        try {
            const { filter, limit, offset } = params;
      
            let totalQuery = `(
                  SELECT count(*) FROM recipes
              ) AS total`;
      
            let endQuery = `
                  ORDER BY recipes.created_at DESC
                  LIMIT ${limit} OFFSET ${offset}
              `;
      
            if (filter) {
              const filterQuery = `
                      WHERE title ILIKE '%${filter}%'
                      OR chefs.name ILIKE '%${filter}%'
                  `;
      
              totalQuery = `(
                      SELECT count(*) FROM recipes
                      ${filterQuery}
                  ) AS total`;
      
              endQuery = `
                    ${filterQuery}
                    ORDER BY recipes.updated_at DESC
                    LIMIT ${limit} OFFSET ${offset}
                  `;
            }
      
            const query = `
                  SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
                  FROM recipes
                  LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                  ${endQuery}
              `;
      
            return db.query(query);
        } catch (error) {
            throw new Error(error);
        }
    },
    files(id) {
        try {
          return db.query(`
            SELECT files.*, recipe_files.file_id AS file_id
            FROM files 
            LEFT JOIN recipe_files ON (recipe_files.file_id = files.id)
            WHERE recipe_files.recipe_id = $1
          `,[id]);
    
        } catch (error) {
          throw new Error(error)
        }
    },
}