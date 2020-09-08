const Chef = require('../../models/admin/Chef')
const { date } = require('../../../lib/utils')

module.exports = {
    index(req, res){
        Chef.all(chefs => {
            return res.render('admin/chefs/index', { chefs })
        })
    },
    create(req, res){
        return res.render('admin/chefs/create')
    },
    post(req, res){
        const keys = Object.keys(req.body)

        for(key of keys){
            if(req.body[key] == ""){
                return res.send(`Please, fill all the form`)
            }
        }
            
        Chef.create(req.body, chef => {
            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },
    show(req, res){ 
        Chef.find(req.params.id, chef => {
            if(!chef) return res.send('chef not found')  
            Chef.findRecipes(chef.id, items => {
                chef.created_at = date(chef.created_at).format
            
                return res.render('admin/chefs/show', {chef, items})
            })                
            
        })
    },
    edit(req, res){
        Chef.find(req.params.id, chef =>{
            if(!chef) return res.send('chef not found')

            return res.render('admin/chefs/edit', {chef})
        })
    },
    put(req, res){
        const keys = Object.keys(req.body)

        for(key of keys){
            if(req.body[key] == "")
                return res.send('Please, fill all the form')
        }

        Chef.update(req.body, ()=> {
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },
    delete(req, res){
        Chef.delete(req.body.id, ()=> {
            return res.redirect(`/admin/chefs/index`)
        })
    }
}