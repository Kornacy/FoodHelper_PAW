const { Model } = require('sequelize');
const { Review, Recipe } = require('../models')

const addReview = async (req, res) => {
    try {
        const user = await req.user;
        const { rating, comment } = req.body;
        const recipeId = req.params.id;
        const recipe = await Recipe.findByPk(recipeId);
        if (recipe.public == false) { return res.status(500).json({ error: "Nie można dodać opini" }) };
        if (recipe.userId == user.id) { return res.status(500).json({ error: "Nie możesz dodawać opini do własnego przepisu" }) }
        const review = await Review.create({ rating, comment, userId: user.id, recipeId })
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const getReviewsForRecipe = async (req, res) => {
    try {
        const user = await req?.user;
        console.log(user?.id);
        const recipeId = req.params.id;
        const recipe = await Recipe.findByPk(recipeId);
        if (!recipe) { return res.status(500).json({ error: "Nie znaleziono przepisu" }) }
        if (recipe.public == false && recipe.userId != user?.id) { return res.status(500).json({ error: "Nie można wyświetlić opini" }) };
        const reviews = await Review.findAll({ where: { recipeId: recipeId } })
        res.json(reviews)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const getReviewsForUsersRecipe = async (req, res) => {
    try {
        const user = await req.user;
        console.log(user.id)
        const reviews = await Review.findAll({
        attributes:['id','rating','comment','createdAt','updatedAt','userId','recipeId'],
        include:[{
        model: Recipe,
        attributes: ['id','title'],
        where: {
            userId: user.id
        },
        required: true
        }]
        }    
        )
        res.json(reviews)
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { addReview, getReviewsForRecipe, getReviewsForUsersRecipe }