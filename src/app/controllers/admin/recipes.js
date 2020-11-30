const Recipe = require('../../models/admin/Recipe')
const File = require('../../models/admin/File')
const RecipeFile = require('../../models/admin/RecipeFile')

module.exports = {
    index(req, res){
        Recipe.all()
        .then(results => {
            const items = results.rows
            return res.render('admin/recipes/index', {items})
        }).catch(err => {
            throw new Error(err)
        })
    },
    async create(req, res){
        try{
            const chefsOptions = (await Recipe.chefSelectOptions()).rows
            return res.render('admin/recipes/create', {chefsOptions})
        } catch(error){
            throw new Error(err)
        }
    },
    async post(req, res){
        try{

            const keys = Object.keys(req.body)
    
            for(key of keys){
                if(req.body[key] == ""){
                    console.log("req.body")
                    return res.send('Please, fill all the form')
                }
            }
    
            if(req.files.length == 0){

                res.send("Please, send at least one file")
            }
    
            const filesPromise = req.files.map((file) => File.create(file))
            const fileIds = await Promise.all(filesPromise)
            
            const itemId = (await Recipe.create(req.body)).rows[0].id
    
            const recipeFilesPromise = fileIds.map(fileId =>{
                RecipeFile.create({
                    recipe_id: recipeId,
                    file_id: fileId.rows[0].id
                })
            })
    
            await Promise.all(recipeFilesPromise)
    
            return res.redirect(`admin/recipes/${itemId}`)
        }catch(error){
            throw new Error(error)
        }
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
            return res.redirect("/admin/recipes")
        })
    }
}