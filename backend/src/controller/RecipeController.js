const { Op, where } = require("sequelize");
const { Recipe, RecipeIngredient, Product, sequelize } = require('../models');
const jwt = require('jsonwebtoken');

const addRecipe = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = await req.user ? req.user.id : null;
        //const userId = user.id
        console.log(`Zalogowany użytkownik o id: ${userId}`)
        const { title, description, instruction, ingredients } = req.body;
        const recipe = await Recipe.create({
            title: title,
            description: description,
            instruction: instruction,
            status: 'published',
            public: false,
            userId: userId
        }, { transaction: t });

        if (ingredients?.length > 0) {
            const ingredientsData = ingredients.map(ing => ({
                recipeId: recipe.id,
                productId: ing.id,
                quantity: ing.quantity

            }))
            await RecipeIngredient.bulkCreate(ingredientsData, { transaction: t });
        }
        await t.commit();
        const newRecipe = await Recipe.findOne({
            where: { id: recipe.id },
            include: [{
                model: Product,
                attributes: ['id', 'name', 'calories'],
                through: {
                    attributes: ['quantity']
                }
            }]
        })
        return res.json(newRecipe);
    }
    catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message })
    }
}
const getMyRecipes = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id
        const myRecipes = await Recipe.findAll({ where: { userId: userId } })
        res.json(myRecipes);
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}
const getPublicRecipes = async (req, res) => {
    try {
        const publicRecipes = await Recipe.findAll({ where: { public: true } })
        res.json(publicRecipes);
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}
const getRecipeDetails = async (req, res) => {
    try {
        let userId = null;
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            const token = authHeader.split(' ')[1]; 
            if (token) {
                try {

                    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'TwojSekretnyKlucz');
                    userId = decoded.id; 
                    console.log(`Zalogowany user ID: ${userId}`);
                } catch (err) {

                    console.log("Token nieważny lub brak, traktuję jako gościa.");
                }
            }
        }
        const recipeId = req.params.id;
        const recipe = await Recipe.findOne({
            where: {
                id: recipeId,
                [Op.or]: [
                    { public: true },
                    { userId: userId }
                ]
            },
            include: [{
                model: Product,
                attributes: ['id', 'name', 'calories','unit'],
                through: {
                    attributes: ['quantity']
                }
            }]
        })
        //console.log(recipe)
        res.json(recipe);
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}
const editRecipe = async (req, res) => { //Metoda ta powinna otrzymać wszytkie pola, jak ich nie otrzyma to usuwa.
    const t = await sequelize.transaction();
    try {
        const user = await req.user;
        const userId = user.id
        const recipeId = req.params.id;
        const { title, description, instruction, ingredients } = req.body;
        const recipe = await Recipe.findOne({ where: { id: recipeId }, userId })
        if (!recipe) {
            await t.rollback();
            return res.status(404).json({ error: "Przepis o takim id nie istnieje lub brak dostępu" })
        }
        await recipe.update({
            title,
            description,
            instruction
        }, { transaction: t });
        await RecipeIngredient.destroy({
            where: { recipeId: recipeId },
            transaction: t
        })
        if (ingredients.length > 0) {
            const ingredientsData = ingredients.map(ing => ({
                recipeId: recipe.id,
                productId: ing.id,
                quantity: ing.quantity

            }))
            await RecipeIngredient.bulkCreate(ingredientsData, { transaction: t });
        }
        await t.commit();
        const updatedRecipe = await Recipe.findOne({
            where: { id: recipeId },
            include: [{
                model: Product,
                attributes: ['id', 'name', 'calories'],
                through: {
                    attributes: ['quantity']
                }
            }]
        })
        res.json(updatedRecipe);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const archiveRecipe = async (req, res) => {
    try {
        const user = await req.user;
        const recipeId = req.params.id;
        const changed = await Recipe.update(
            {
                status: 'archived',
                public: false
            },
            {
                where: {
                    id: recipeId,
                    userId: user.id
                }
            }
        )
        if (changed == 0) { return res.status(500).json({ error: "Operacja się nie powiodła" }) }
        res.json(changed);
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const publishRecipe = async (req, res) => {
    try {
        const user = await req.user;
        const recipeId = req.params.id;
        const changed = await Recipe.update(
            {
                status: 'published',
            },
            {
                where: {
                    id: recipeId,
                    userId: user.id
                }
            }
        )
        if (changed == 0) { return res.status(500).json({ error: "Operacja się nie powiodła" }) }
        res.json(changed);
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const draftRecipe = async (req, res) => {
    try {
        const user = await req.user;
        const recipeId = req.params.id;
        const changed = await Recipe.update(
            {
                status: 'draft',
                public: false
            },
            {
                where: {
                    id: recipeId,
                    userId: user.id
                }
            }
        )
        if (changed == 0) { return res.status(500).json({ error: "Operacja się nie powiodła" }) }
        res.json(changed);
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const publicRecipe = async (req, res) => {
    try {
        const user = await req.user;
        const recipeId = req.params.id;
        const changed = await Recipe.update(
            {
                status: 'published',
                public: true
            },
            {
                where: {
                    id: recipeId,
                    userId: user.id
                }
            }
        )
        if (changed == 0) { return res.status(500).json({ error: "Operacja się nie powiodła" }) }
        res.json(changed);
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const deleteRecipe = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const user = await req.user;
        const recipeId = req.params.id;
        await RecipeIngredient.destroy(
            {
                where:
                    { recipeId: recipeId },
                transaction: t
            })
        const deleted = await Recipe.destroy(
            {
                where: {
                    userId: user.id,
                    id: recipeId
                },
                transaction: t
            }
        )
        if (!deleted) {
            t.rollback();
            return res.status(404).json({ message: "Przepis nie znaleziony" })
        }
        await t.commit();
        res.json(deleted)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


module.exports = { addRecipe, getMyRecipes, getPublicRecipes, getRecipeDetails, editRecipe, archiveRecipe, publishRecipe, draftRecipe, publicRecipe, deleteRecipe }