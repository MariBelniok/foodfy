const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')
const user = require('./app/controllers/user')
const recipes = require('./app/controllers/admin/recipes')
const chefs = require('./app/controllers/admin/chefs')

routes.get('/', (req, res) => {
    return res.redirect('index')
})
routes.get('/index', user.index)
routes.get('/about', user.about)
routes.get('/recipes', user.recipes)
routes.get('/chefs', user.chefs)
routes.get('/search', user.search)
routes.get('/chefs/:id', user.showChef)
routes.get('/info/:id', user.showRecipes)


routes.get('/admin/recipes', recipes.index)
routes.get('/admin/recipes/create', recipes.create)
routes.get('/admin/recipes/:id', recipes.show)
routes.get('/admin/recipes/:id/edit', recipes.edit)
routes.post('/admin/recipes', multer.array("image", 5), recipes.post)
routes.put('/admin/recipes',multer.array("image", 5), recipes.put)
routes.delete('/admin/recipes', recipes.delete)


routes.get('/admin/chefs', chefs.index)
routes.get('/admin/chefs/create', chefs.create)
routes.get('/admin/chefs/:id', chefs.show)
routes.get('/admin/chefs/:id/edit', chefs.edit)
routes.post('/admin/chefs', multer.array("image", 1), chefs.post)
routes.put('/admin/chefs', multer.array("image", 1), chefs.put)
routes.delete('/admin/chefs', chefs.delete)

routes.get('*', (req, res) => {
    return res.render('not-found')
})

module.exports = routes