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
        <div className="add-recipe-wrapper">
    <div className="add-recipe-container">
        <div className="form-header">
            <Link to="/my-recipes" className="back-link">
                Anuluj edycję
            </Link>
            <h1 className="form-title">Edytuj Przepis</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="recipe-form">
            <div className="form-section">
                <div className="form-group">
                    <label className="form-label">Tytuł przepisu</label>
                    <input 
                        type="text" 
                        name="title" 
                        className="form-control" 
                        value={formData.title} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Krótki opis</label>
                    <textarea 
                        name="description" 
                        className="form-control description-area" 
                        value={formData.description} 
                        onChange={handleChange} 
                    />
                </div>
            </div>

            <div className="form-section ingredients-section">
                <label className="form-label">Składniki</label>
                <div className="ingredient-adder-box">
                    <div className="ingredient-inputs">
                        <div className="select-wrapper">
                            <select 
                                className="form-control" 
                                value={currentIngredient.productId} 
                                onChange={e => setCurrentIngredient({...currentIngredient, productId: e.target.value})}
                            >
                                <option value="">Wybierz produkt</option>
                                {allProducts.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.unit || 'szt'})</option>
                                ))}
                            </select>
                        </div>
                        <div className="quantity-wrapper">
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
                        >
                            Dodaj
                        </button>
                    </div>
                    
                    <p className="helper-text">
                        Aby zmienić ilość, usuń składnik z listy poniżej i dodaj go ponownie z nową wartością.
                    </p>
                </div>

                <div className="ingredients-list-wrapper">
                    {addedIngredients.length > 0 ? (
                        <ul className="ingredient-list">
                            {addedIngredients.map((ing, index) => (
                                <li key={index} className="ingredient-item">
                                    <span className="ing-name">
                                        <strong>{ing.name}</strong>
                                    </span>
                                    <span className="ing-qty">
                                        {ing.quantity} {ing.unit}
                                    </span>
                                    <button type="button" className="btn-remove" onClick={() => handleRemoveIngredient(index)}>
                                        Usuń
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="empty-ingredients">
                            Brak składników w przepisie.
                        </div>
                    )}
                </div>
            </div>

            <div className="form-section">
                <div className="form-group">
                    <label className="form-label">Instrukcja przygotowania</label>
                    <textarea 
                        name="instruction" 
                        className="form-control instruction-area" 
                        value={formData.instruction} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                        <input 
                            type="checkbox" 
                            name="public" 
                            checked={formData.public} 
                            onChange={handleChange} 
                        />
                        <span className="checkbox-text">Upublicznij ten przepis</span>
                    </label>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="submit-btn">Zapisz Zmiany</button>
            </div>
        </form>
    </div>
</div>
    );
};

export default EditRecipe;