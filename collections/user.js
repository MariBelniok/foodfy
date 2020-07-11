const data = require('../data.json')

exports.index = (req, res) => {
    return res.render('user/index', { items: data.recipes})
}

exports.about = (req, res) => {
    return res.render('user/about', {items: data.recipes})
}

exports.recipes = (req, res) => {
    return res.render('user/recipes', {items: data.recipes})
}

exports.info = (req, res) => {
    const { id }  = req.params
        const info = data.recipes.find(function (info) {
        return info.id === id
    })
    if(!info) {
        return res.send("Receita não encontrada!")
    }

    return res.render('user/info', {item: info})
}