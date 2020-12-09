const Recipe = require('../../models/admin/Recipe')
const File = require('../../models/admin/File')

module.exports = {
    async index(req, res){
        try{
            let { page, limit, filter } = req.query

            page = page || 1
            limit = limit || 8

            let offset = limit * (page - 1)

            const params = {
                limit, 
                offset, 
                page, 
                filter
            }

            let items = (await Recipe.paginate(params)).rows
            const recipesTemp = []

            for(const item of items){
                let files = (await Recipe.files(item.id)).rows

                files = files.map((file) => ({
                    ...file,
                    src: `${req.protocol}://${req.headers.host}${file.path.replace(
                        "public",
                        ""
                    )}`
                }))
                recipesTemp.push({
                    ...item,
                    images: files,
                })
            }

            items = recipesTemp

            const pagination = {
                total: Math.ceil(items[0].total / limit),
                page,
            }
            return res.render('admin/recipes/index', {items, pagination, filter})
        }catch(error){
            throw new Error(error)
        }
    },
    async create(req, res){
        try{
            const chefsOptions = (await Recipe.chefSelectOptions()).rows
            return res.render('admin/recipes/create', {chefsOptions})
        } catch(error){
            throw new Error(error)
        }
    },
    async post(req, res){
        try{
            const keys = Object.keys(req.body)
    
            for(key of keys){
                if(req.body[key] == "" && key != "removed_files"){
                    return res.send('Please, fill all the form')
                }
            }
    
            if(req.files.length == 0){
                res.send("Please, send at least one file")
            }

            const filesPromise = req.files.map((file) => File.create(file));
            const fileIds = await Promise.all(filesPromise);

            const recipeId = (await Recipe.create(req.body)).rows[0].id;

            const recipeFilesPromise = fileIds.map((fileId) =>
                File.createRecipeFiles({
                recipe_id: recipeId,
                file_id: fileId.rows[0].id,
                })
            );

            await Promise.all(recipeFilesPromise);
    
            return res.redirect(`/admin/recipes/${recipeId}`)
        }catch(error){
            throw new Error(error)
        }
    },
    async show(req, res){
        try{
            let results = await Recipe.find(req.params.id)
            const item = results.rows[0]
            if(!item) return res.send('Recipe not found')
    
            return res.render('admin/recipes/show', {item})
        }catch(error){
            throw new Error(error)
        }   
    },
    async edit(req, res) {
        try{
            let results = await Recipe.find(req.params.id)
            const item = results.rows[0]

            if(!item) return res.send('Recipe not found')

            const options =(await Recipe.chefSelectOptions()).rows
            return res.render("admin/recipes/edit", {item, chefsOptions: options})
        }catch(error){
            throw new Error(error)
        }
    },
    async put(req, res){
        try{
            const keys = Object.keys(req.body)

            for(key of keys){
                if(req.body[key] == "")
                    return res.send('Please, fill all the form')
            }

            if(req.files.length != 0){
                const newFilesPromise = req.files.map(file => File.create({...file, product_id: req.body.id}))
            }

        }catch(error){
            throw new Error(error)
        }
        
    },
    async delete(req, res){
        try{
            await Recipe.delete(req.body.id)
            return res.redirect("/admin/recipes")
        }catch(error){
            throw new Error(error)
        }
        
    }
}