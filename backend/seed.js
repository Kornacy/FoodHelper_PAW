const { sequelize, User, Product, Recipe, Review } = require('./src/models'); 
const bcrypt = require('bcrypt');

async function seed() {
    try {
        console.log('Laczenie z baza i czyszczenie danych...');
        
        await sequelize.sync({ force: true }); 
        
        console.log('Baza wyczyszczona.');

        // 1. TWORZENIE UŻYTKOWNIKÓW
        console.log('Dodawanie uzytkownikow...');
        
        const passwordHash = await bcrypt.hash('haslo123', 10);

        const usersData = [
            { username: 'admin', email: 'admin@food.pl', role: 'admin', password_hash: passwordHash },
            { username: 'jan_kowalski', email: 'jan@food.pl', role: 'user', password_hash: passwordHash },
            { username: 'anna_nowak', email: 'anna@food.pl', role: 'user', password_hash: passwordHash },
            { username: 'piotr_smakosz', email: 'piotr@food.pl', role: 'user', password_hash: passwordHash }
        ];

        const users = await User.bulkCreate(usersData, { returning: true });
        const [admin, jan, anna, piotr] = users;

        console.log(`Dodano ${users.length} uzytkownikow.`);

        // 2. TWORZENIE PRODUKTÓW
        console.log('Dodawanie duzej bazy produktow...');
        
        const productsData = [
            // Nabiał i Jaja (0-7)
            { name: 'Mleko 3.2%', unit: 'ml', calories: 60 },
            { name: 'Jajka L', unit: 'szt', calories: 70 },
            { name: 'Ser zolty Gouda', unit: 'g', calories: 356 },
            { name: 'Maslo 82%', unit: 'g', calories: 717 },
            { name: 'Smietana 18%', unit: 'ml', calories: 186 },
            { name: 'Twarog poltlusty', unit: 'g', calories: 133 },
            { name: 'Jogurt naturalny', unit: 'ml', calories: 60 },
            { name: 'Mozzarella', unit: 'g', calories: 280 },

            // Sypkie (8-14)
            { name: 'Maka pszenna', unit: 'g', calories: 364 },
            { name: 'Cukier bialy', unit: 'g', calories: 387 },
            { name: 'Makaron Spaghetti', unit: 'g', calories: 371 },
            { name: 'Ryz bialy', unit: 'g', calories: 365 },
            { name: 'Platki owsiane', unit: 'g', calories: 389 },
            { name: 'Chleb pszenny', unit: 'g', calories: 70 },
            { name: 'Bulka tarta', unit: 'g', calories: 347 },

            // Warzywa i Owoce (15-24)
            { name: 'Pomidor', unit: 'szt', calories: 22 },
            { name: 'Cebula', unit: 'szt', calories: 40 },
            { name: 'Czosnek', unit: 'szt', calories: 5 },
            { name: 'Ziemniaki', unit: 'g', calories: 77 },
            { name: 'Marchew', unit: 'szt', calories: 30 },
            { name: 'Papryka czerwona', unit: 'szt', calories: 50 },
            { name: 'Pieczarki', unit: 'g', calories: 22 },
            { name: 'Jablko', unit: 'szt', calories: 52 },
            { name: 'Banan', unit: 'szt', calories: 89 },
            { name: 'Cytryna', unit: 'szt', calories: 20 },

            // Mięso (25-28)
            { name: 'Piers z kurczaka', unit: 'g', calories: 165 },
            { name: 'Mieso mielone wolowe', unit: 'g', calories: 250 },
            { name: 'Szynka wieprzowa', unit: 'g', calories: 45 },
            { name: 'Boczek wedzony', unit: 'g', calories: 300 },

            // Inne (29-36)
            { name: 'Olej rzepakowy', unit: 'ml', calories: 884 },
            { name: 'Oliwa z oliwek', unit: 'ml', calories: 824 },
            { name: 'Sol', unit: 'mg', calories: 0 },
            { name: 'Pieprz czarny', unit: 'mg', calories: 0 },
            { name: 'Cynamon', unit: 'mg', calories: 6 },
            { name: 'Proszek do pieczenia', unit: 'mg', calories: 2 },
            { name: 'Salata lodowa', unit: 'g', calories: 14 },
            { name: 'Ogorek zielony', unit: 'szt', calories: 15 }
        ];
        
        const products = await Product.bulkCreate(productsData, { returning: true });
        console.log(`Dodano ${products.length} produktow.`);

        // 3. WYPEŁNIANIE LODÓWKI
        console.log('Wypelnianie lodowek...');

        // Jan (Tradycyjna kuchnia)
        await jan.addProduct(products[0], { through: { quantity: 1000 } }); // Mleko
        await jan.addProduct(products[1], { through: { quantity: 12 } });   // Jajka
        await jan.addProduct(products[26], { through: { quantity: 500 } }); // Mięso
        await jan.addProduct(products[16], { through: { quantity: 5 } });   // Cebula

        // Anna (Fit)
        await anna.addProduct(products[25], { through: { quantity: 600 } }); // Kurczak
        await anna.addProduct(products[6], { through: { quantity: 500 } });  // Jogurt
        await anna.addProduct(products[35], { through: { quantity: 1 } });   // Sałata
        await anna.addProduct(products[30], { through: { quantity: 250 } }); // Oliwa

        // Piotr (Desery i przekąski)
        await piotr.addProduct(products[8], { through: { quantity: 1000 } }); // Mąka
        await piotr.addProduct(products[9], { through: { quantity: 1000 } }); // Cukier
        await piotr.addProduct(products[3], { through: { quantity: 200 } });  // Masło
        await piotr.addProduct(products[22], { through: { quantity: 6 } });   // Jabłka

        console.log('Produkty dodane do lodowek.');

        // 4. TWORZENIE PRZEPISÓW
        console.log('Dodawanie przepisow...');

        // Przepis 1: Naleśniki (Jan)
        const recipe1 = await Recipe.create({
            title: 'Domowe Nalesniki',
            description: 'Idealne na sniadanie lub kolacje.',
            instruction: '1. Zmiksuj mleko, jajka, make i olej.\n2. Smaz cienkie placki.',
            status: 'published',
            public: true,
            userId: jan.id
        });
        await recipe1.addProduct(products[0], { through: { quantity: 500 } }); // Mleko
        await recipe1.addProduct(products[1], { through: { quantity: 2 } });   // Jajka
        await recipe1.addProduct(products[8], { through: { quantity: 250 } }); // Mąka
        await recipe1.addProduct(products[29], { through: { quantity: 30 } }); // Olej

        // Przepis 2: Spaghetti Bolognese (Jan)
        const recipe2 = await Recipe.create({
            title: 'Spaghetti Bolognese',
            description: 'Klasyk kuchni wloskiej.',
            instruction: '1. Ugotuj makaron.\n2. Podsmaz mieso z cebula i czosnkiem.\n3. Dodaj pomidory i przyprawy.',
            status: 'published',
            public: true,
            userId: jan.id
        });
        await recipe2.addProduct(products[10], { through: { quantity: 400 } }); // Makaron
        await recipe2.addProduct(products[26], { through: { quantity: 500 } }); // Mięso
        await recipe2.addProduct(products[15], { through: { quantity: 4 } });   // Pomidor
        await recipe2.addProduct(products[16], { through: { quantity: 2 } });   // Cebula
        await recipe2.addProduct(products[17], { through: { quantity: 2 } });   // Czosnek

        // Przepis 3: Satatka z kurczakiem (Anna)
        const recipe3 = await Recipe.create({
            title: 'Lekka salatka z kurczakiem',
            description: 'Zdrowy lunch do pracy.',
            instruction: '1. Usmaz kurczaka.\n2. Pokroj warzywa.\n3. Wymieszaj z oliwa.',
            status: 'published',
            public: true,
            userId: anna.id
        });
        await recipe3.addProduct(products[25], { through: { quantity: 200 } }); // Kurczak
        await recipe3.addProduct(products[35], { through: { quantity: 100 } }); // Sałata
        await recipe3.addProduct(products[15], { through: { quantity: 2 } });   // Pomidor
        await recipe3.addProduct(products[36], { through: { quantity: 1 } });   // Ogórek
        await recipe3.addProduct(products[30], { through: { quantity: 15 } });  // Oliwa

        // Przepis 4: Owsianka z bananem (Anna - Draft)
        const recipe4 = await Recipe.create({
            title: 'Poranna Owsianka',
            description: 'Szybki zastrzyk energii.',
            instruction: 'Zalej platki goracym mlekiem i dodaj banana.',
            status: 'draft',
            public: false,
            userId: anna.id
        });
        await recipe4.addProduct(products[12], { through: { quantity: 50 } });  // Płatki
        await recipe4.addProduct(products[0], { through: { quantity: 200 } });  // Mleko
        await recipe4.addProduct(products[23], { through: { quantity: 1 } });   // Banan

        // Przepis 5: Szarlotka (Piotr)
        const recipe5 = await Recipe.create({
            title: 'Szarlotka Babci',
            description: 'Kruche ciasto z jablkami i cynamonem.',
            instruction: '1. Zagniec ciasto.\n2. Zetrzyj jablka.\n3. Piecz 50 min w 180C.',
            status: 'published',
            public: true,
            userId: piotr.id
        });
        await recipe5.addProduct(products[8], { through: { quantity: 300 } });  // Mąka
        await recipe5.addProduct(products[3], { through: { quantity: 200 } });  // Masło
        await recipe5.addProduct(products[9], { through: { quantity: 150 } });  // Cukier
        await recipe5.addProduct(products[22], { through: { quantity: 5 } });   // Jabłko
        await recipe5.addProduct(products[33], { through: { quantity: 1 } });   // Cynamon

        // Przepis 6: Tosty z serem (Piotr)
        const recipe6 = await Recipe.create({
            title: 'Szybkie tosty',
            description: 'Gdy nie ma czasu na gotowanie.',
            instruction: 'Wloz do opiekacza.',
            status: 'published',
            public: true,
            userId: piotr.id
        });
        await recipe6.addProduct(products[13], { through: { quantity: 2 } });   // Chleb
        await recipe6.addProduct(products[2], { through: { quantity: 50 } });   // Ser
        await recipe6.addProduct(products[27], { through: { quantity: 2 } });   // Szynka
        await recipe6.addProduct(products[3], { through: { quantity: 10 } });   // Masło

        console.log('Przepisy i skladniki dodane.');

        // 5. DODAWANIE OPINII
        console.log('Dodawanie opinii...');

        await Review.create({ rating: 5.0, comment: 'Pyszne nalesniki!', userId: anna.id, recipeId: recipe1.id });
        await Review.create({ rating: 4.0, comment: 'Dobre, ale za tluste.', userId: piotr.id, recipeId: recipe1.id });
        await Review.create({ rating: 5.0, comment: 'Uwielbiam te szarlotke.', userId: admin.id, recipeId: recipe5.id });
        await Review.create({ rating: 3.0, comment: 'Malo miesa.', userId: jan.id, recipeId: recipe2.id });

        console.log('Opinie dodane.');
        console.log('SUKCES! Seed ukonczony.');

    } catch (error) {
        console.error('Blad podczas seedowania:', error);
    } finally {
        await sequelize.close();
    }
}

seed();