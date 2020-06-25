const express = require('express')
const nunjucks = require('nunjucks')

const recipe = module.exports = require('./data')
const server = express()

server.set('view engine', 'njk')
server.use(express.static('public'))

nunjucks.configure('views', {
    express:server, 
    autoescape: false,
    noCache: true
})

server.get('/', (req, res) => {
    return res.render('index', { items: recipe})
})
server.get('/about', (req, res) => {
    return res.render('about', {items: recipe})
})
server.get('/recipes', (req, res) => {
    return res.render('recipes', {items: recipe})
})
server.get('/info', (req, res) => {
    const id = req.query.id
    const info = recipe.find(function (info) {
        return info.id === id
    })
    if(!info) {
        return res.send("Receita não encontrada!")
    }

    return res.render('info', {item: info})
})


server.get('*', (req, res) => {
    return res.render('not-found')
})


server.listen(3000, function(){
    console.log('Server listening on localhost:3000')
})