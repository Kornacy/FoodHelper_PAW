const express = require('express');
const app = express();
const session = require('express-session')
require('dotenv').config();
const { sequelize } = require('./src/models'); 
const PORT = process.env.PORT;
const productController = require('./src/controller/ProductController')
const userController = require('./src/controller/UserController')
const passport = require('passport');
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sesionStore
}))
app.use(passport.initialize());
app.use(passport.session())
async function startApp() {
  try {
    console.log("⏳ Łączenie z bazą danych...");

    await sequelize.sync({ alter: true });
    
    console.log("✅ Sukces! Baza danych i tabele są gotowe.");

    app.listen(PORT, () => {
      console.log(`🚀 Serwer działa na porcie ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Błąd startu aplikacji:", error.message);
    console.log("Podpowiedź: Upewnij się, że kontener Docker z bazą działa.");
  }
}
app.post('/user/login',userController.login)
app.post('/api/product',productController.addProduct);
app.put('/api/product/:productId',productController.editProduct);
app.post('/user/register',userController.register);
startApp();