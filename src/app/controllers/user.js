const User = require('../models/User')
const Recipe = require('../models/admin/Recipe')

module.exports = {
    async index(req, res){
        try {
            let { filter } = req.query

            const params = {
                limit: 6,
                offset: 0,
                filter
            }
            let items = (await Recipe.paginate(params)).rows
            const recipesTemp = []

            for(const item of items){
                let files = (await Recipe.files(item.id)).rows
                
                files = files.map(file => ({
                    ...file,
                    src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
                }))

                recipesTemp.push({
                    ...items,
                    images: files
                })
            }
            items = recipesTemp

            return res.render('user/index', {items})

        }catch(error){
            throw new Error(error)
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