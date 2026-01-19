import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllProducts } from '../services/fridgeService'; 
import { getRecipeDetails, editRecipe } from '../services/recipeService';
import './AddRecipe.css';

const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({title: '',description: '',instruction: '',public: false});
    const [addedIngredients, setAddedIngredients] = useState([]); 
    const [allProducts, setAllProducts] = useState([]); 
    const [currentIngredient, setCurrentIngredient] = useState({productId: '',quantity: ''});

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const [productsData, recipeData] = await Promise.all([
                    getAllProducts(),
                    getRecipeDetails(id)
                ]);

                setAllProducts(productsData);

                setFormData({
                    title: recipeData.title,
                    description: recipeData.description,
                    instruction: recipeData.instruction,
                    public: recipeData.public
                });

                if (recipeData.Products) {
                    const mappedIngredients = recipeData.Products.map(p => {

                        const qty = p.RecipeIngredient?.quantity || p.RecipeProduct?.quantity || p.through?.quantity || 0;
                        
                        return {
                            productId: p.id,        
                            name: p.name,           
                            unit: p.unit || 'szt',  
                            quantity: qty           
                        };
                    });
                    setAddedIngredients(mappedIngredients);
                }

                setLoading(false);
            } catch (error) {
                console.error("Błąd pobierania danych do edycji:", error);
                alert("Nie udało się pobrać danych przepisu.");
                navigate('/my-recipes');
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    const handleAddIngredient = (e) => {
        e.preventDefault(); 
        

        if (!currentIngredient.productId || !currentIngredient.quantity) {
            alert("Najpierw wybierz produkt z listy i wpisz ilość!");
            return;
        }

        const selectedId = Number(currentIngredient.productId);
        

        const productObj = allProducts.find(p => p.id === selectedId);

        if (!productObj) {
            console.error("Nie znaleziono produktu o ID:", selectedId);
            return;
        }

        const newIng = {
            productId: selectedId,
            quantity: parseFloat(currentIngredient.quantity),
            name: productObj.name,
            unit: productObj.unit || 'szt'
        };


        setAddedIngredients(prev => [...prev, newIng]);
        

        setCurrentIngredient({ productId: '', quantity: '' });
    };

    const handleRemoveIngredient = (indexToRemove) => {
        setAddedIngredients(prev => prev.filter((_, index) => index !== indexToRemove));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentIngredient.productId && currentIngredient.quantity) {
            const confirmAdd = window.confirm("Masz wpisany składnik, ale nie kliknąłeś '+'. Czy chcesz go dodać przed zapisem?");
            if (confirmAdd) {
                alert("Kliknij 'plus' obok składnika i spróbuj zapisać ponownie.");
                return;
            }
        }

        if (!formData.title || !formData.instruction) {
            alert("Tytuł i instrukcja są wymagane!");
            return;
        }

        const payload = {
            title: formData.title,
            description: formData.description,
            instruction: formData.instruction,
            public: formData.public,
            status: formData.public ? 'published' : 'draft', 
            
            ingredients: addedIngredients.map(ing => ({
                id: ing.productId, 
                quantity: ing.quantity
            }))
        };

        console.log("Wysyłany payload (Edit):", payload);

        try {
            await editRecipe(id, payload);
            alert("Zmiany zostały zapisane! 💾");
            navigate('/my-recipes'); 
        } catch (error) {
            console.error("Błąd edycji:", error);
            const msg = error.response?.data?.error || "Nie udało się zapisać zmian.";
            alert(msg);
        }
    };

    if (loading) return <div className="add-recipe-container">Ładowanie danych edycji...</div>;

    return (
        <div className="add-recipe-container">
            <Link to="/my-recipes" style={{ display: 'block', marginBottom: '20px' }}>← Anuluj edycję</Link>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Edytuj Przepis ✏️</h1>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tytuł przepisu*</label>
                    <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Krótki opis</label>
                    <textarea name="description" className="form-control" style={{minHeight: '60px'}} value={formData.description} onChange={handleChange} />
                </div>


                <div className="form-group">
                    <label>Składniki</label>
                    
                    <div className="ingredient-adder" style={{background: '#fff3cd', border: '1px solid #ffeeba'}}>
                        <div style={{flex: 2}}>
                            <select 
                                className="form-control" 
                                value={currentIngredient.productId} 
                                onChange={e => setCurrentIngredient({...currentIngredient, productId: e.target.value})}
                            >
                                <option value="">-- Wybierz produkt --</option>
                                {allProducts.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.unit || 'szt'})</option>
                                ))}
                            </select>
                        </div>
                        <div style={{flex: 1}}>
                            <input 
                                type="number" 
                                className="form-control" 
                                placeholder="Ilość" 
                                value={currentIngredient.quantity} 
                                onChange={e => setCurrentIngredient({...currentIngredient, quantity: e.target.value})} 
                            />
                        </div>
                        
                        <button 
                            type="button" 
                            className="btn-add-ing" 
                            onClick={handleAddIngredient}
                            style={{fontWeight: 'bold', fontSize: '1.2rem', backgroundColor: '#ffc107', color: '#000'}}
                        >
                            +
                        </button>
                    </div>
                    
                    <small style={{color: '#666', display: 'block', marginTop: '5px', marginBottom: '10px'}}>
                        ℹ️ Aby zmienić ilość, usuń składnik i dodaj go ponownie z nową wartością.
                    </small>

                    {addedIngredients.length > 0 ? (
                        <ul className="ingredient-list">
                            {addedIngredients.map((ing, index) => (
                                <li key={index} className="ingredient-item">
                                    <span><strong>{ing.name}</strong>: {ing.quantity} {ing.unit}</span>
                                    <button type="button" className="btn-remove" onClick={() => handleRemoveIngredient(index)}>Usuń</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{fontStyle: 'italic', color: '#999'}}>Brak składników w przepisie.</p>
                    )}
                </div>

                <div className="form-group">
                    <label>Instrukcja przygotowania*</label>
                    <textarea name="instruction" className="form-control" style={{minHeight: '150px'}} value={formData.instruction} onChange={handleChange} required />
                </div>

                <div className="form-group" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <input type="checkbox" id="publicCheck" name="public" checked={formData.public} onChange={handleChange} style={{width: '20px', height: '20px'}} />
                    <label htmlFor="publicCheck" style={{marginBottom: 0, cursor: 'pointer'}}>Upublicznij ten przepis</label>
                </div>

                <button type="submit" className="submit-btn" style={{backgroundColor: '#e67e22'}}>Zapisz Zmiany</button>
            </form>
        </div>
    );
};

export default EditRecipe;