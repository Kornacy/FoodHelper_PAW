const { UserFridge, Product, User } = require("../models")

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
        //const {quantity} = req.body;
        console.log(`Usuwanie produktu o ProductId: ${prodId} z lodówki użytkownika:  ${userId}`);
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
        console.log(`Pobieranie danych lodówki użytkownika o id: ${userId}.`)
        const userdata = await User.findByPk(userId, {
            include: [{
                model: Product,
                attributes: ['id','name','calories','unit'],
                through: {
                    attributes: ['quantity']
                }
            }]
        });
        if(!userdata) {return res.status(500); }

        const products = userdata.Products.map(product => ({
            id: product.id,
            name: product.name,
            calories: product.calories,
            unit: product.unit,
            quantity: product.UserFridge.quantity
        }));

        console.log(`Pobrane dane: ${products}`)
        res.json(products);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Błąd przy pobieraniu produktów z lodówki"})
    }
}

module.exports = {addProductToFridgeFromList, updateProductQuantity, deleteProduct, getAllProducts}