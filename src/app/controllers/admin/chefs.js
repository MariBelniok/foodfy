const Chef = require('../../models/admin/Chef')
const File = require('../../models/admin/File')
const { date } = require('../../../lib/utils')

module.exports = {
    async index(req, res){
        try{
            let chefs = (await Chef.all()).rows
            const chefTemp = []

            for(let chef of chefs){
                const file = (await File.find(chef.file_id)).rows[0]

                chefTemp.push({
                    ...chef,
                    photo: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                })
            }

            chefs = chefTemp

            return res.render('admin/chefs/index', { chefs })
        }catch(error){
            throw new Error(error)
        }
    },
    create(req, res){
        try{
            return res.render('admin/chefs/create')
        }catch(error){
            throw new Error(error)
        }
    },
    async post(req, res){
        
        const keys = Object.keys(req.body)
        
        for(key of keys){
            if(req.body[key] == "" && key != "removed_files"){
                return res.send(`Please, fill all the form`)
            }
        }
        
        if(req.files === 0){
            return res.send('Por favor, envie pelo menos uma foto')
        }

        try{    
            const filesPromise = req.files.map(file => File.create({...file}))

            let results = await filesPromise[0]
            const fileId = results.rows[0].id
            

            const chefId = (await Chef.create({...req.body, file_id: fileId})).rows[0].id


            return res.redirect(`/admin/chefs/create`)

        }catch(error){
            throw new Error(error)
        }
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