const { UserFridge, Product } = require("../models")

const addProductToFridgeFromList = async (req,res) =>{ 
    //Ta funkcja działa tylko dla produktów które są już w bazie, planowane wykorzystanie razem z funkcją getDefaultProducts.
    try{
        const loggedUser = await req.user
        const userId = loggedUser.id;
        const {prodId} = req.params;
        const {quantity} = req.body;
        console.log(`Zalogowany użytkownik o ID: ${userId} ProductId: ${prodId} Quantity: ${quantity}`);
        const productExists = await Product.findByPk(prodId)
        if(!productExists){return res.status(404).json({error: "Nie ma takiego produktu"})}
        if(!userId){return res.status(404).json({error: "Użytkownik nie zalogowany"})} 
        const pairExists = await UserFridge.findOne({where: {userId:userId, productId:prodId}})
        if(pairExists){return res.status(520).json({error: "Produkt już istnieje"})}
        const productInFridge = await UserFridge.create(
            {quantity,userId,productId: prodId}
        )
        if(!productInFridge) {return res.status(500); }
        res.json(productInFridge);
        //console.log(userId)
    }
    catch (err){
        res.status(500).json({error: "Błąd dodawania produktu do lodówki"})
    }
}
const updateProductQuantity = async (req,res) => {
    try{
        const loggedUser = await req.user
        const userId = loggedUser.id;
        const {prodId} = req.params;
        const {quantity} = req.body;
        console.log(`Zalogowany użytkownik o ID: ${userId} ProductId: ${prodId} Quantity: ${quantity}`);
        const productExists = await Product.findByPk(prodId)
        if(!productExists){return res.status(404).json({error: "Nie ma takiego produktu"})}
        if(!userId){return res.status(404).json({error: "Użytkownik nie zalogowany"})} 
        const pairExists = await UserFridge.findOne({where: {userId:userId, productId:prodId}})
        if(!pairExists){return res.status(521).json({error: "Produkt nie istnieje w tej lodówce"})}
        const rows = await UserFridge.update(
            {quantity:quantity},
            {where: {productId:prodId, userId:userId}}
        );
        if(!rows) {return res.status(500); }
        res.json(rows);
    }
    catch(err){
        res.status(500).json({error: "Błąd edycji produktu w lodówce"})
    }
}
const deleteProduct = async (req,res) => {
    try{
        const loggedUser = await req.user
        const userId = loggedUser.id;
        const {prodId} = req.params;
        const {quantity} = req.body;
        console.log(`Zalogowany użytkownik o ID: ${userId} ProductId: ${prodId} Quantity: ${quantity}`);
        const productExists = await Product.findByPk(prodId)
        if(!productExists){return res.status(404).json({error: "Nie ma takiego produktu"})}
        if(!userId){return res.status(404).json({error: "Użytkownik nie zalogowany"})} 
        const pairExists = await UserFridge.findOne({where: {userId:userId, productId:prodId}})
        if(!pairExists){return res.status(521).json({error: "Produkt nie istnieje w tej lodówce"})}
        const deleted = await UserFridge.destroy(
            {where: {productId:prodId, userId:userId}}
        );
        if(!deleted) {return res.status(500); }
        res.json(deleted);
    }
    catch(err){
        res.status(500).json({error: "Błąd usuwania produktu z lodówki"})
    }
}
const getAllProducts = async (req,res) => {
    try{
        const loggedUser = await req.user
        const userId = loggedUser.id;
        const products = await UserFridge.findAll(
            {where: {userId:userId}}
        );
        if(!products) {return res.status(500); }
        res.json(products);
    }
    catch(err){
        res.status(500).json({error: "Błąd przy pobieraniu produktów z lodówki"})
    }
}

module.exports = {addProductToFridgeFromList, updateProductQuantity, deleteProduct, getAllProducts}