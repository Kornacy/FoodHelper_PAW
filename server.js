//Moduły
const express = require('express');
const session = require('express-session')
const passport = require('passport');
require('dotenv').config();
const SequelizeStore = require('connect-session-sequelize')(session.Store)

//Importy
const { sequelize } = require('./src/models'); 
const productController = require('./src/controller/ProductController')
const userController = require('./src/controller/UserController')
const isAuth = require('./src/middleware/auth');

const app = express();
app.use(express.json());
const PORT = process.env.PORT;
//Start sesji
require("./src/config/passport")
const sessionStore = new SequelizeStore({
  db: sequelize,
});
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}))
sessionStore.sync();
app.use(passport.initialize());
app.use(passport.session())
//Start aplikacji
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
//Endpointy API
app.post('/api/user/login',userController.login)
app.post('/api/product',isAuth,productController.addProduct);
app.put('/api/product/:productId',productController.editProduct);
app.post('/api/user/register',userController.register);
app.post('/api/user/logout',userController.logout)

startApp();
