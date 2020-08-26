const User = require('../models/User')

module.exports = {
    index(req, res){
        return res.render('user/index')
    },
    about(req, res){
        return res.render('user/about')
    },
    recipes(req, res){
        return res.render('user/recipes')
    },
    info(req, res){
        const { id }  = req.params
        const info = data.recipes.find(function (info) {
        return info.id == id
        })
        if(!info) {
            return res.send("Receita não encontrada!")
        }
        return res.render('user/info', { item })
    }
}