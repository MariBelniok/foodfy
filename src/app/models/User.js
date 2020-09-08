const db = require('../../config/db')

module.exports = {
    all(callback) {
        db.query(`
        SELECT recipes.*, chefs.name AS chefs_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY recipes.created_at DESC`, (err, results) => {
            if (err) throw `Database ${err}`
            callback(results.rows)
        })
    },
    find(id, callback){
        db.query(`
        SELECT recipes.*, chefs.name AS chefs_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id], (err, results) => {
            if (err) throw `Database ${err}`
            callback(results.rows[0])
        })
    },
    findBy(filter, callback) {
        db.query(`
        SELECT recipes.*, chefs.name AS chefs_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY recipes.created_at DESC`, (err, results) => {
            if (err) throw `Database ${err}`
            callback(results.rows)
        })
    },
    allChefs(callback) {
        db.query(`
        SELECT * 
        FROM chefs`, (err, results) => {
            if (err) throw `Database ${err}`
            callback(results.rows)
        })
    },
    findChefs(id, callback){
        db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON(recipes.chef_id = chefs.id)
        WHERE chefs.id = $1
        GROUP BY chefs.id`, [id], (err, results)=>{
            if (err) throw `Database ${err}`
            callback(results.rows[0])
        })
    },
    findRecipes(id, callback){
        db.query(`
        SELECT recipes.*, chefs.name AS chefs_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE chef_id = $1`, [id], (err, results) => {
            if(err) throw `Database ${err}`
            callback(results.rows)
        })
    },
}