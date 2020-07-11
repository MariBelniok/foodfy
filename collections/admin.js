const fs = require('fs')
const data = require('../data.json')

exports.index = (req, res) => {
    return res.render('admin/index', {items: data.recipes})
}

exports.create = (req, res) => {
    return res.render('admin/create')
}

exports.show = (req, res) => {
    const { id }  = req.params
    const info = data.recipes.find((recipe) => {
    return recipe.id == id
    })
    if(!info) {
        return res.send("Receita não encontrada!")
    }

    return res.render('admin/show', {item: info})
}

exports.edit = (req, res) => {
    const { id } = req.params

    const info = data.recipes.find((info) => {
        return info.id == id  
    })
    if(!info){
        return res.send("Not found")
    }
    return res.render('admin/edit', {item: info})
}

exports.post = (req, res) => {
    const keys = Object.keys(req.body)

    for(key of keys) {
        if(req.body[key] == "") {
            return res.send("Please, fill all the fields")
        }
    }

    let id = 1
    const lastRecipe = data.recipes[data.recipes.length - 1]
    if(lastRecipe){
        id = lastRecipe.id + 1
    }

    data.recipes.push({
        id,
        ...req.body
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 4), (err) => {
        if(err) return res.send("Write error")
        return res.redirect('/admin/index')
    })
}

exports.put = (req, res) => {
    const { id } = req.body
    let index 

    const foundRecipe = data.recipes.find((recipe, foundIndex) => {
        if (recipe.id == id){
            index = foundIndex
            return true
        }
    })
    if(!foundRecipe) return res.send("Recipe not found")

    const recipe = {
        ...foundRecipe,
        ...req.body
    }

    data.recipes[index] = recipe

    fs.writeFile("data.json", JSON.stringify(data, null, 4), (err) => {
        if(err) return res.send("Write error: " + err.message)

        return res.redirect(`/admin/${id}`)
    })
}

exports.delete = (req, res) => {
    const { id } = req.body

    const filteredRecipes = data.recipes.filter((recipe) => {
        return (recipe.id != id)
    })

    data.recipes = filteredRecipes

    fs.writeFile("data.json", JSON.stringify(data, null, 4), (err) => {
        if(err) return res.send("Write error")

        res.redirect("/admin/index")
    })
}