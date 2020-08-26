const { Pool } = require('pg')

module.exports = new Pool({
    user: "marianna",
    password: "marianna",
    host: "localhost",
    port: 5432,
    database: "foodfy"
})