const express = require('express')
const routes = express.Router()
const user = require('./collections/user')
const admin = require('./collections/admin')

routes.get('/', (req, res) => {
    return res.redirect('index')
})
routes.get('/index', user.index)
routes.get('/about', user.about)
routes.get('/recipes', user.recipes)
routes.get('/info/:id', user.info)


routes.get('/admin/index', admin.index)
routes.get('/admin/create', admin.create)
routes.get('/admin/:id', admin.show)
routes.get('/admin/:id/edit', admin.edit)
routes.post('/admin', admin.post)
routes.put('/admin', admin.put)
routes.delete('/admin', admin.delete)

routes.get('*', (req, res) => {
    return res.render('not-found')
})

module.exports = routes