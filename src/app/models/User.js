const db = require('../../config/db')

module.exports = {
    all() {
        try{
            return db.query(`
            SELECT recipes.*, chefs.name AS chefs_name 
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY recipes.created_at DESC`)
        }catch(error){
            throw new Error(error)
        }
    },
    find(id){
        try{
            return db.query(`
            SELECT recipes.*, chefs.name AS chefs_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1`, [id])
        }catch(error){
            throw new Error(error)
        }
    },
    findBy(filter) {
        try{
            return db.query(`
            SELECT recipes.*, chefs.name AS chefs_name 
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.title ILIKE '%${filter}%'
            ORDER BY recipes.created_at DESC`)
        }catch(error){
            throw new Error(error)
        }
    },
    allChefs() {
        try{
            return db.query(`
            SELECT * 
            FROM chefs`)
        }catch(error){
            throw new Error(error)
        }
    },
    findChefs(id){
        try{
        return db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON(recipes.chef_id = chefs.id)
            WHERE chefs.id = $1
            GROUP BY chefs.id`, [id])
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
                WHERE chef_id = $1`, [id])
        }catch(error){
            throw new Error(error)
        }
    },
    paginate(params){
        try{
            const { filter, limit, offset } = params
    
            let query ="",
                filterQuery ="",
                totalQuery = `(
                SELECT count(*) 
                FROM recipes
                ) AS total`
                
            if(filter){
                filterQuery = ` ${query}
                    WHERE recipes.title ILIKE '%${filter}%'
                    OR chefs.name ILIKE '%${filter}%'
                `
                totalQuery = `(
                    SELECT count(*) FROM recipes
                    ${filterQuery}
                ) AS total`
            }
            query = `
                SELECT recipes.*, ${totalQuery}
                FROM recipes
                ${filterQuery}
                LIMIT $1 OFFSET $2
            ` 
            return db.query(query, [limit, offset])
        }catch(error){
        throw new Error(error)
        }
    }
}