import api from './api'
//GET
//publiczne przepisu
export const getPublicRecipes = async() => {
    const res = await api.get('/api/recipes');
    return res.data;
}
//własne przepisy
export const getMyRecipes = async () => {
    const res = await api.get('/api/myrecipes');
    return res.data;
};

//szczegóły jednego przepisu po id przepisu
export const getRecipeDetails = async (id) => {
    const res = await api.get(`/api/recipe/${id}`);
    return res.data;
};

//POST
//dodanie przepisu
export const addRecipe = async (data) => {
    const res = await api.post('/api/recipe/add', data);
    return res.data;
};

// Edytuj istniejący przepis
export const editRecipe = async (id, data) => {
    const res = await api.put(`/api/recipe/${id}`, data);
    return res.data;
};

//PATCH
//archiwizowanie
export const archiveRecipe = async (id) => {
    const res = await api.patch(`/api/recipe/archive/${id}`);
    return res.data;
};
//upublicznianie
export const publicRecipe = async (id) => {
    const res = await api.patch(`/api/recipe/public/${id}`);
    return res.data;
};
//publikowanie, (widać jako gotowy przepis ale tylko dla siebie)
export const publishRecipe = async (id) => {
    const res = await api.patch(`/api/recipe/publish/${id}`);
    return res.data;
};
//zapisywanie jak wersja robocza
export const draftRecipe = async (id) => {
    const res = await api.patch(`/api/recipe/draft/${id}`);
    return res.data;
};

//DELETE
export const deleteRecipe = async (id) => {
    const res = await api.delete(`/api/recipe/delete/${id}`);
    return res.data;
};
