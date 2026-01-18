const sequelize = require("../config/db");

const User = require('./User');
const Product = require('./Product');
const Recipe = require('./Recipe');
const Review = require('./Review');
const RecipeIngredient = require('./RecipeIngredient');
const UserFridge = require('./UserFridge');

User.hasMany(Recipe, { foreignKey: 'userId' });
Recipe.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(Product, { through: UserFridge, foreignKey: 'userId' });
Product.belongsToMany(User, { through: UserFridge, foreignKey: 'productId' });

Recipe.belongsToMany(Product, { through: RecipeIngredient, foreignKey: 'recipeId' });
Product.belongsToMany(Recipe, { through: RecipeIngredient, foreignKey: 'productId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

Recipe.hasMany(Review, { foreignKey: 'recipeId' });
Review.belongsTo(Recipe, { foreignKey: 'recipeId' });

module.exports = {
    sequelize,
    User,
    Product,
    Recipe,
    Review,
    RecipeIngredient,
    UserFridge
};