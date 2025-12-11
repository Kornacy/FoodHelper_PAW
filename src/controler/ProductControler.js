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
module.exports = { addProduct };