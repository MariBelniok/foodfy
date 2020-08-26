const Recipe = require('../../models/admin/Recipe')
const { date } = require('../../../lib/utils') 

module.exports = {
    index(req, res){
        Recipe.all(items => {
            return res.render('admin/recipes/index', {items})
        })
    },
    create(req, res){
        Recipe.chefSelectOptions(options => {
            return res.render('admin/recipes/create', {chefsOptions: options})
        })
    },
    post(req, res){
        const keys = Object.keys(req.body)

        for(key of keys){
            if(req.body[key] == "")
                return res.send('Please, fill all the form')
        }
        Recipe.create(req.body, item =>{
            return res.redirect(`/admin/recipes/${item.id}`)
        })
    },
    show(req, res){
        Recipe.find(req.params.id, item => {
            if(!item) return res.send('Recipe not found')

            return res.render('admin/recipes/show', {item})
        })        
    },
    edit(req, res) {
        Recipe.find(req.params.id, item => {
            if(!item) return res.send('Recipe not found')

            Recipe.chefSelectOptions(options =>{
                return res.render("admin/recipes/edit", {item, chefsOptions: options})
            })
        })
    },
    put(req, res){
        const keys = Object.keys(req.body)

        for(key of keys){
            if(req.body[key] == "")
                return res.send('Please, fill all the form')
        }
        Recipe.update(req.body, ()=>{
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },
    delete(req, res){
        Recipe.delete(req.body.id, ()=>{
            return res.redirect("/admin/recipes/index")
        })
    }
}