const db = require('../../../config/db')
const { date } = require('../../../lib/utils')

module.exports = {
    all() {
        try{
            return db.query(`
                SELECT chefs.*, count(recipes) AS total_recipes
                FROM chefs
                LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                GROUP BY chefs.id
                ORDER BY total_recipes DESC
            `)
        }catch(error){
            throw new Error(error)
        }
    },
    create(data){
        try{
            const query = `
                INSERT INTO chefs(
                name,
                file_id
                )VALUES($1, $2)
                RETURNING id
                `
            const values = [
                data.name,
                data.file_id
            ]
            return db.query(query, values)
        }catch(error){
            throw new Error(error)
        }
    },
    find(id){
        try{
            return db.query(`
                SELECT chefs.*, count(recipes) AS total_recipes
                FROM chefs
                LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
                WHERE chefs.id = $1
                GROUP BY chefs.id`, [id]
            )
        }catch(error){
            throw new Error(error)
        }
    },
    findRecipes(id){
        try{
            return db.query(`
                SELECT recipes.*, chefs.name AS chefs_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE chef_id = $1`, [id]
            )
        }catch(error){
            throw new Error(error)
        }
    },
    update(data){
        try{
        const query = `
            UPDATE chefs SET
                name=($1),
                file_id=($2)
            WHERE id = $3
            `
        const values = [
            data.name,
            data.file_id,
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
                DELETE 
                FROM chefs 
                WHERE id = $1`, [id]
            )
        }catch(error){
            throw new Error(error)
        }
    }
}
