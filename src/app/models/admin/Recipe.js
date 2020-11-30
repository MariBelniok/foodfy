const db = require('../../../config/db')
const { date } = require('../../../lib/utils')
module.exports = {
    all() {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY recipes.created_at DESC
            `
        )
    },
    create(data) {
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
    },
    find(id, callback){
        db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id], (err, results) => {
            if (err) throw `Database ${err}`
            callback(results.rows[0])
        })
    },
    update(data, callback){
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

        db.query(query, values, (err, results) => {
            if (err) throw `Database ${err}`
            callback()
        })
    },
    delete(id, callback){
        db.query(`DELETE FROM recipes WHERE id = $1`, [id], (err, results) => {
            if (err) throw `Database ${err}`

            return callback()
        })
    },
    chefSelectOptions(callback){
        return db.query(`SELECT id, name FROM chefs`)
        
    }
}