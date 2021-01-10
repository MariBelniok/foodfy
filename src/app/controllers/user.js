const File = require('../models/admin/File')
const Recipe = require('../models/admin/Recipe')
const Chef = require('../models/admin/Chef')


module.exports = {
    async index(req, res){
        try{
            let recipeResults = await Recipe.all() 
            let items = recipeResults.rows

            async function getImage(itemId) {
                let recipeResults = await Recipe.files(itemId)
        
                const files = recipeResults.rows.map( file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
        
                return files[0]
              }
        
                const recipesPromise = items.map( async item => {
                item.image = await getImage(item.id)
        
                return item
              }).filter((item, index) => index > 5 ? false : true)
        
              items = await Promise.all(recipesPromise)

            return res.render('user/index', {items})
        }catch(error){
            console.log(error)
        }
    },
    about(req, res){
        return res.render('user/about')
    },
    async recipes(req, res){
        try{
            let { page, limit, filter } = req.query

            page = page || 1
            limit = limit || 6

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
            
            return res.render('user/recipes', {items, pagination, filter})
        }catch(error){
            console.error(error)
        }
    },
    async showRecipes(req, res){
        try {
            let recipeResults = await Recipe.find(req.params.id)
            const item = recipeResults.rows[0]

            if(!item) return res.render('not-found')

            recipeResults = await Recipe.files(item.id)
            const files = recipeResults.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render('user/info', { item, files })
        } catch (error) {
            console.log(error)
        }
            
    },
    async chefs(req, res){
        try {
            const recipeResults = await Chef.all()
            let chefs = recipeResults.rows

            async function getImage(chefId){
                let recipeResults = await Chef.file(chefId)
                const files = recipeResults.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

                return files[0]
            }

            const chefsPromise = await chefs.map(async chef => {
                chef.avatar = await getImage(chef.id)

                return chef
            })

            chefs = await Promise.all(chefsPromise)

            res.render('user/chefs', { chefs })
        } catch (error) {
            console.error(error)
        }
    },
    async showChef(req, res){
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

            return res.render('user/showChefs', { chef, items })
        } catch (error) {
            console.log(error)
        }
    },
    async search(req, res){
        try {
            let { page, limit, filter} = req.query

            page = page || 1
            limit = limit || 2
            let offset = limit * (page - 1)

            const params = {
                page,
                limit,
                filter,
                offset
            }

            let recipeResults = await Recipe.paginate(params)
            let items = recipeResults.rows

            if (items == "") {
                const pagination = { page }

                return res.render('user/search', { items, pagination })
            }
            const pagination = { 
                total: Math.ceil(items[0].total / limit),
                page
            }

            async function getImage(itemId){
                let recipeResults = await Recipe.files(itemId)

                const files = recipeResults.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

                return files[0]
            }

            const itemsPromise = items.map(async item => {
                item.image = await getImage(item.id)

                return item
            })

            items = await Promise.all(itemsPromise)

            return res.render('user/search', { items, pagination, filter })
        } catch (error) {
            console.log(error)
        }
    }
}