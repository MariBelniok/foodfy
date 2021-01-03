const Chef = require('../../models/admin/Chef')
const File = require('../../models/admin/File')

module.exports = {
    async index(req, res){
        try{
            let chefs = (await Chef.all()).rows
            const chefTemp = []

            for(let chef of chefs){
                const file = (await File.find(chef.file_id)).rows[0]

                chefTemp.push({
                    ...chef,
                    image: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
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


            return res.redirect(`/admin/chefs/${chefId}`)

        }catch(error){
            throw new Error(error)
        }
    },
    async show(req, res){ 
        try{
            const { id } = req.params

            let chef = (await Chef.find(id)).rows[0]

            if(!chef) return res.send('Chef not found')

            let items = (await Chef.findRecipes(chef.id)).rows
            const recipesTemp = []

            for(const recipe of items){
                let recipeId = recipe.id
                let files = (await File.findRecipeFiles(recipeId)).rows
                
                files = files.map((file) => ({
                    ...file, 
                    src: `${req.protocol}://${req.headers.host}${file.path.replace(
                        "public",
                        ""
                    )}`
                }))
                recipesTemp.push({
                    ...recipe,
                    files
                })

            }

            items = recipesTemp
            

            const file = (await File.find(chef.file_id)).rows[0]

            chef = {  
                ...chef,
                src: `${req.protocol}://${req.headers.host}${file.path.replace(
                    "public",
                    ""
                )}`
            };
            return res.render("admin/chefs/show", { chef, items })
        }catch(error){
            throw new Error(error)
        }
    },
    async edit(req, res){
        try{
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]

            results = await Chef.file(chef.id)
            
            const file = (await File.find(chef.file_id)).rows[0]

            const files = {
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }
            return res.render("admin/chefs/edit", { chef, files })
        }catch(error){
            throw new Error(error)
        }
        
    },
    async put(req, res){
        try{ 
            const keys = Object.keys(req.body)
            
            for(key of keys){
                if(req.body[key] == "" && key != "removed_files"){
                    return res.send(`Please, fill all the form`)
                }
            }

            if(req.files){
                const { id } = req.body

                const chef = (await Chef.find(id)).rows[0]

                if(!chef) return res.send('Chef not found')

                const filesPromise = req.files.map(file => File.create({...file}))

                let results = await filesPromise[0]
                let fileId = results.rows[0].id
                
                const chefData = {...req.body, file_id: fileId}
                await Chef.update(chefData)
            }

            
            return res.redirect(`/admin/chefs/${req.body.id}`)

        }catch(error){
            throw new Error(error)
        }
    },
    async delete(req, res){
        try {
            const { id } = req.body
            let results = await Chef.find(id)

            results = await Chef.findRecipes(id)
            const recipes = results.rows

            if(recipes.length == 0){
                await Chef.delete(id)

                res.redirect('/admin/chefs')
            }else{
                res.send("You can't delete a chef that has recipes!")
            }
        } catch (error) {
            throw new Error(error)
        }
    }
}