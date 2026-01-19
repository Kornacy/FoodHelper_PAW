import api from './api';
//GET
//Pobierz zawartość lodówki
export const getFridgeItems = async () => {
    const response = await api.get('/api/fridge');
    return response.data;
};

//Pobierz listę wszystkich dostępnych produktów (żeby móc coś dodać)
export const getAllProducts = async () => {
    const response = await api.get('/api/products');
    return response.data;
};
//POST
//Dodaj produkt do lodówki z listy
export const addToFridge = async (productId) => {
    const response = await api.post(`/api/fridge/add/${productId}`, { quantity: 1 });
    return response.data;
};
//Dodaj nowy produkt do bazy
export const createNewProduct = async (productData) => {
    const response = await api.post('/api/product', productData); 
    return response.data;
};
//DELETE
//Usuń produkt z lodówki
export const removeFromFridge = async (productId) => {
    const response = await api.delete(`/api/fridge/delete/${productId}`);
    return response.data;
};
//PATCH
//Zaktualizuj ilość
export const updateQuantity = async (productId, quantity) => {
    const response = await api.put(`/api/fridge/update/${productId}`, { quantity });
    return response.data;
};
