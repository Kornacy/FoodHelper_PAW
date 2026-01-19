import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/fridgeService'; 
import { addRecipe } from '../services/recipeService';
import './AddRecipe.css';

const AddRecipe = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({title: '',description: '',instruction: '',public: false});
    const [addedIngredients, setAddedIngredients] = useState([]); 
    const [allProducts, setAllProducts] = useState([]); 
    const [currentIngredient, setCurrentIngredient] = useState({productId: '',quantity: ''});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getAllProducts();
                console.log("Załadowane produkty z bazy:", products);
                setAllProducts(products);
                setLoading(false);
            } catch (error) {
                console.error("Błąd pobierania produktów:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddIngredient = (e) => {
        e.preventDefault(); 
        
        console.log("Próba dodania składnika:", currentIngredient);


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

        console.log("Dodaję do listy:", newIng);


        setAddedIngredients(prev => [...prev, newIng]);

        setCurrentIngredient({ productId: '', quantity: '' });
    };

    const handleRemoveIngredient = (indexToRemove) => {
        setAddedIngredients(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Aktualna lista składników (addedIngredients):", addedIngredients);
        if (addedIngredients.length === 0 && currentIngredient.productId && currentIngredient.quantity) {
            alert("Wpisałeś składnik, ale nie kliknąłeś przycisku '+'. Kliknij plusik, aby dodać składnik do listy!");
            return;
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

        console.log("Wysyłany payload:", payload);

        try {
            await addRecipe(payload);
            alert("Przepis dodany pomyślnie!");
            navigate('/my-recipes'); 
        } catch (error) {
            console.error("Błąd wysyłania:", error);
            alert("Nie udało się dodać przepisu.");
        }
    };

    if (loading) return <div className="add-recipe-container">Ładowanie produktów...</div>;

    return (
        <div className="add-recipe-container">
            <Link to="/my-recipes" style={{ display: 'block', marginBottom: '20px' }}>← Anuluj</Link>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Dodaj Nowy Przepis 📝</h1>
            
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
                    <div className="ingredient-adder" style={{background: '#eef', border: '1px solid #ccd'}}>
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
                            style={{fontWeight: 'bold', fontSize: '1.2rem'}}
                        >
                            +
                        </button>
                    </div>
                    
                    <small style={{color: '#666', display: 'block', marginTop: '5px', marginBottom: '10px'}}>
                        ℹ️ Wybierz produkt, wpisz ilość i <strong>kliknij przycisk "+"</strong> powyżej, aby dodać do listy.
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
                        <p style={{fontStyle: 'italic', color: '#999'}}>Lista składników jest pusta.</p>
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

                <button type="submit" className="submit-btn">Zapisz Przepis</button>
            </form>
        </div>
    );
};

export default AddRecipe;