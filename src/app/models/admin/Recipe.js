const db = require('../../../config/db')
const { date } = require('../../../lib/utils')
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
                info,
                created_at
                )VALUES($1, $2, $3, $4, $5, $6)
                RETURNING id
            `
            const values = [
                data.chef,
                data.title,
                data.ingredients,
                data.prepare,
                data.info,
                date(Date.now()).iso
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
                WHERE recipes.id = $1`, [id])
        }catch(error){
            throw new Error(error)
        }
    },
    update(data){
        try{
            const query = `
                UPDATE recipes SET
                    chef_id=($1),
                    image=($2),
                    title=($3),
                    ingredients=($4),
                    prepare=($5),
                    info=($6)
                WHERE id=$7
            `
            const values = [
                data.chef,
                data.image,
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
    delete(id){
        try{
            return db.query(`
                DELETE FROM recipes 
                WHERE id = $1`, [id])
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
                      ${endQuery}
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