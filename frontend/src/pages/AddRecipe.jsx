import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/fridgeService';
import { addRecipe } from '../services/recipeService';
import './AddRecipe.css';

const AddRecipe = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', description: '', instruction: '', public: false });
    const [addedIngredients, setAddedIngredients] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [currentIngredient, setCurrentIngredient] = useState({ productId: '', quantity: '' });
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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
        <div className="add-recipe-wrapper">
            <div className="add-recipe-container">
                <div className="form-header">
                    <Link to="/my-recipes" className="back-link">
                        Anuluj
                    </Link>
                    <h1 className="form-title">Dodaj Nowy Przepis</h1>
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
                                placeholder="np. Spaghetti Carbonara"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Krótki opis</label>
                            <textarea
                                name="description"
                                className="form-control description-area"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Opisz krótko swoje danie..."
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
                                        onChange={e => setCurrentIngredient({ ...currentIngredient, productId: e.target.value })}
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
                                        onChange={e => setCurrentIngredient({ ...currentIngredient, quantity: e.target.value })}
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
                                Wybierz produkt, wpisz ilość i kliknij przycisk Dodaj, aby uzupełnić listę.
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
                                    Lista składników jest pusta.
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
                                placeholder="Krok po kroku..."
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">Zapisz Przepis</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRecipe;