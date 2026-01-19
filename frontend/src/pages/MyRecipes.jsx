import React, { useEffect, useState } from "react"; 
import { Link } from 'react-router-dom';
import { getMyRecipes, deleteRecipe, publicRecipe, draftRecipe} from '../services/recipeService';
import './PublicRecipes.css'; 

const MyRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getMyRecipes();
            setRecipes(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Nie udało się pobrać Twoich przepisów.");
            setLoading(false);
        }
    };

    const handleTogglePublic = async (recipe) => {
        try {
            if (recipe.public) {
                await draftRecipe(recipe.id);
                setRecipes(prev => prev.map(r => 
                    r.id === recipe.id ? { ...r, public: false } : r
                ));
            } else {
                await publicRecipe(recipe.id);
                setRecipes(prev => prev.map(r => 
                    r.id === recipe.id ? { ...r, public: true } : r
                ));
            }
        } catch (error) {
            console.error(error);
            alert("Błąd podczas zmiany statusu przepisu.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten przepis?")) return;
        
        try {
            await deleteRecipe(id);
            setRecipes(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error(error);
            alert("Nie udało się usunąć przepisu.");
        }
    };

    if (loading) return <div className="home-container"><p>Ładowanie Twoich przepisów...</p></div>;
    if (error) return <div className="home-container"><p style={{ color: 'red' }}>{error}</p></div>;

    return (
        <div className="home-container">
            <Link to="/start">← Wróć do panelu</Link>
            
            <div style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '30px',
                borderBottom: '1px solid #eee',
                paddingBottom: '20px'
            }}>
                <h1 className="page-title" style={{marginBottom: 0}}>Moje Przepisy 👨‍🍳</h1>
                
                <Link to="/add-recipe">
                    <button className="action-btn btn-public" style={{
                        width: 'auto', 
                        padding: '12px 25px', 
                        fontSize: '1rem',
                        backgroundColor: '#2ecc71'
                    }}>
                        + Dodaj Przepis
                    </button>
                </Link>
            </div>
            
            {recipes.length === 0 ? (
                <div style={{textAlign: 'center', marginTop: '50px'}}>
                    <p>Nie masz jeszcze żadnych przepisów.</p>
                    <Link to="/add-recipe" style={{color: '#3498db', fontWeight: 'bold'}}>
                        Kliknij tutaj, aby dodać pierwszy!
                    </Link>
                </div>
            ) : (
                <div className="recipes-grid">
                    {recipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card">
                            
                            <span className={`status-badge ${recipe.public ? 'status-public' : 'status-private'}`}>
                                {recipe.public ? 'PUBLICZNY' : 'SZKIC'}
                            </span>

                            <div className="recipe-info">
                                <h3>{recipe.title}</h3>
                                <p className="recipe-desc">
                                    {recipe.description || "Brak opisu."}
                                </p>
                            </div>

                            <div className="my-recipes-actions">
                                <Link to={`/recipes/${recipe.id}`}>
                                    <button className="action-btn btn-details">
                                        👁️ Zobacz szczegóły
                                    </button>
                                </Link>

                                <Link to={`/edit-recipe/${recipe.id}`}>
                                    <button className="action-btn btn-edit">
                                        ✏️ Edytuj
                                    </button>
                                </Link>

                                <button 
                                    className={`action-btn ${recipe.public ? 'btn-private' : 'btn-public'}`}
                                    onClick={() => handleTogglePublic(recipe)}
                                >
                                    {recipe.public ? '🔒 Ukryj (Szkic)' : '🌍 Upublicznij'}
                                </button>

                                <button 
                                    className="action-btn btn-delete"
                                    onClick={() => handleDelete(recipe.id)}
                                >
                                    🗑️ Usuń
                                </button>
                            </div>
                            
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyRecipes;