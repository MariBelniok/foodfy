const db = require('../../../config/db')

module.exports = {
    create(data) {
        try{
            const query = `
                INSERT INTO files(
                name,
                path,
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
    }
}