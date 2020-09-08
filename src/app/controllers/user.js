const User = require('../models/User')

module.exports = {
    index(req, res){
        const { filter } = req.query
        if(filter){
            User.findBy(filter, items => {
                return res.render('user/index', {items})
            })
        }else{
            User.all(items => {
                return res.render('user/index', {items})
            })
        } 
    },
    about(req, res){
        return res.render('user/about')
    },
    recipes(req, res){
        const { filter } = req.query
        if(filter){
            User.findBy(filter, items => {
                return res.render('user/recipes', {items})
            })
        }else{
            User.all(items => {
                return res.render('user/recipes', {items})
            })
        } 
    },
    chefs(req, res){
        User.allChefs(chefs => {
            return res.render('user/chefs', {chefs})
        })
    },
    showChef(req, res){
        User.findChefs(req.params.id, chef => {
            User.findRecipes(chef.id, items => {
                return res.render('user/showChefs', {chef, items})
            })
        })
    },
    info(req, res){
        User.find(req.params.id, item => {
            if(!item) {
                return res.send("Receita não encontrada!")
            }
            return res.render('user/info', { item })
        })
    },
    search(req, res){
        const { filter } = req.query

        if(filter){
            User.findBy(filter, items => {
                return res.render('user/search', {filter, items})
            })
        }else{
            return res.send("Receita não encontrada!")
        }
    }
}