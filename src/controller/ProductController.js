const { where, Op } = require("sequelize");
const { Product } = require("../models");

const addProduct = async (req,res) => {
    try{
        const { name, unit, calories } = req.body;
        const newProduct = await Product.create({name,unit,calories});
        res.json(newProduct) 
    }
    catch (err){
        res.status(500).json({error: err.message});
    }
};
const editProduct = async (req,res) => {
    try{
        const {productId }= req.params;
        const {name, unit, calories } = req.body;
        const [updatedCount,updatedRows] = await Product.update({name: name,unit: unit,calories: calories}, {where: {id:productId}})
        res.json(updatedCount);
    }
    catch (err){
        res.status(500).json({error:err.message});
    }
}
const getProductById = async (req,res) => {
    try{
        const {productId} = req.params;
        const product = await Product.findByPk(productId);
        if(!product){ 
            return res.status(404).json({error: "Nie znaleziono produktu"})
        }
        res.json(product);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}
const getDefaultProducts = async (req,res) => {
    try{
        const products = await Product.findAll({where: {id: {[Op.lte]: 100}}})
        res.json(products);
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}
module.exports = { addProduct, editProduct, getProductById, getDefaultProducts};