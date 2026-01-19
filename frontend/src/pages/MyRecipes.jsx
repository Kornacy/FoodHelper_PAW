import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getMyRecipes, deleteRecipe, publicRecipe, draftRecipe } from '../services/recipeService';
import './MyRecipes.css';

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
            {/* 1. Link wyciągnięty przed nagłówek */}
            <Link to="/start" className="back-link-top">
                ← Wróć do panelu
            </Link>

            {/* 2. Nagłówek zawiera tylko Tytuł i Przycisk */}
            <header className="page-header-row">
                <h1 className="page-title">Moje Przepisy</h1>

                <Link to="/add-recipe" className="add-recipe-btn">
                    Dodaj Przepis
                </Link>
            </header>

            {recipes.length === 0 ? (
                <div className="empty-state">
                    <p>Nie masz jeszcze żadnych przepisów.</p>
                    <Link to="/add-recipe" className="empty-link">
                        Kliknij tutaj, aby dodać pierwszy!
                    </Link>
                </div>
            ) : (
                <div className="recipes-grid">
                    {recipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card">

                            <div className="card-top">
                                <span className={`status-badge ${recipe.public ? 'status-public' : 'status-private'}`}>
                                    {recipe.public ? 'Publiczny' : 'Szkic'}
                                </span>
                            </div>

                            <div className="recipe-info">
                                <h3>{recipe.title}</h3>
                                <p className="recipe-desc">
                                    {recipe.description || "Brak opisu."}
                                </p>
                            </div>

                            <div className="card-actions">
                                <Link to={`/recipes/${recipe.id}`} className="details-link-full">
                                    <button className="action-btn btn-details">
                                        Zobacz szczegóły
                                    </button>
                                </Link>

                                <div className="admin-actions">
                                    <Link to={`/edit-recipe/${recipe.id}`} className="action-link">
                                        <button className="action-btn btn-edit">
                                            Edytuj
                                        </button>
                                    </Link>

                                    <button
                                        className={`action-btn ${recipe.public ? 'btn-private' : 'btn-public'}`}
                                        onClick={() => handleTogglePublic(recipe)}
                                    >
                                        {recipe.public ? 'Ukryj' : 'Upublicznij'}
                                    </button>

                                    <button
                                        className="action-btn btn-delete"
                                        onClick={() => handleDelete(recipe.id)}
                                    >
                                        Usuń
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyRecipes;