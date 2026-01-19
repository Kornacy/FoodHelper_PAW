import React, { useEffect, useState } from "react"; 
import { getPublicRecipes } from '../services/recipeService';
import { Link } from 'react-router-dom';
import './PublicRecipes.css'; 

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const recdata = await getPublicRecipes();
                setRecipes(recdata);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Nie udało się pobrać przepisów.");
                setLoading(false);
            }
        };
        getData();
    }, []);

    if (loading) return <div className="home-container"><p>Ładowanie przepisów...</p></div>;
    if (error) return <div className="home-container"><p style={{ color: 'red' }}>{error}</p></div>;

    return (
       <div className="home-container">
    <header className="page-header">
        <Link to="/start" className="back-link">
            Wróć do panelu
        </Link>
        <h1 className="page-title">Odkrywaj Przepisy</h1>
    </header>
    
    {recipes.length === 0 ? (
        <div className="empty-state">
            <p>Brak publicznych przepisów w bazie.</p>
        </div>
    ) : (
        <div className="recipes-grid">
            {recipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                    
                    <div className="recipe-info">
                        <h3>{recipe.title}</h3>
                        <p className="recipe-desc">
                            {recipe.description || "Kliknij szczegóły, aby zobaczyć składniki i sposób przygotowania tego pysznego dania."}
                        </p>
                    </div>

                    <div className="recipe-actions">
                        <Link to={`/recipes/${recipe.id}`} className="details-link">
                            <button className="details-btn">
                                Zobacz szczegóły
                            </button>
                        </Link>
                    </div>
                    
                </div>
            ))}
        </div>
    )}
</div>
    );
}

export default Home;