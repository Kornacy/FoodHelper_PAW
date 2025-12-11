const express = require('express');
const app = express();
require('dotenv').config();
const { sequelize } = require('./src/models'); 
const PORT = process.env.PORT;
const productControler = require('./src/controller/ProductController')
app.use(express.json());

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
app.post('/api/product',productControler.addProduct);
app.put('/api/product/:productId',productControler.editProduct);
startApp();