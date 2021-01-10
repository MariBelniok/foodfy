const db = require('../../../config/db')
const fs = require("fs")
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
    create({name, file_id}){
        try{
            const query = `
                INSERT INTO chefs(
                name,
                created_at,
                file_id
                )VALUES($1, $2, $3)
                RETURNING id
                `
            const values = [
                name,
                date(Date.now()).iso,
                file_id
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
                WHERE chef_id = $1
                ORDER BY recipes.created_at DESC`, [id]
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
    async delete(id){
        try{
            const results = await db.query(`
                SELECT files.* FROM files
                INNER JOIN chefs ON (files.id = chefs.file_id)
                WHERE chefs.id = $1`, [id]
            )
            const removedFiles = results.rows.map(async file => {
                fs.unlinkSync(file.path)

                await db.query(`DELETE FROM chefs WHERE id = $1`, [id])
                return db.query(`DELETE FROM files WHERE id = $1`, [file.id])
            })
        }catch(error){
            throw new Error(error)
        }
    },
    file(id){
        try {
            return db.query(`
            SELECT files.* FROM files
            LEFT JOIN chefs ON (files.id = chefs.file_id)
            WHERE chefs.id = $1`, [id]
            )
        } catch (error) {
            throw new Error(error)
        }
        
    }
}