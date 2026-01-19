import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipeDetails, getRecipeReviews, addRecipeReview } from '../services/recipeService';
import './RecipeDetails.css';

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, description: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isUserLoggedIn = !!localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recipeData, reviewsData] = await Promise.all([
                    getRecipeDetails(id),
                    getRecipeReviews(id)
                ]);

                setRecipe(recipeData);
                setReviews(reviewsData);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Nie udało się pobrać szczegółów przepisu.");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await addRecipeReview(id, newReview);


            const updatedReviews = await getRecipeReviews(id);
            setReviews(updatedReviews);

            setNewReview({ rating: 5, comment: '' });
            alert("Dziękujemy za opinię! ⭐");
        } catch (error) {
            console.error(error);
            alert("Nie udało się dodać recenzji. Spróbuj ponownie.");
        }
    };

    if (loading) return <div className="details-container">Ładowanie szczegółów... 🍲</div>;
    if (error) return <div className="details-container" style={{ color: 'red' }}>{error}</div>;
    if (!recipe) return <div className="details-container">Nie znaleziono przepisu.</div>;

    return (
        <div className="details-container">
            <Link to="/start" className="back-link">← Powrót do strony głównej</Link>


            <div className="recipe-header">
                <h1>{recipe.title}</h1>
                <p className="recipe-desc">{recipe.description}</p>
            </div>


            <div className="recipe-content">
                <div className="section-box">
                    <h3>Składniki:</h3>
                    <div className="ingredients-list">
                        {recipe.Products && recipe.Products.length > 0 ? (
                            <ul>
                                {recipe.Products.map(product => (
                                    <li key={product.id} style={{ marginBottom: '5px' }}>
                                        <strong>{product.name}</strong>
                                        {console.log(product)}
                                        {' '} — {product.RecipeIngredient.quantity} {product.unit || 'szt/g'}
                                        <span style={{ color: '#7f8c8d', fontSize: '0.9em' }}>
                                            {' '}({product.calories} kcal)
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Brak informacji o składnikach (lub są wpisane w opisie).</p>
                        )}
                    </div>
                </div>

                <div className="section-box">
                    <h3>Sposób przygotowania</h3>
                    <div className="steps-text">
                        {recipe.instruction}
                    </div>
                </div>
            </div>


            <div className="reviews-section">
                <h2>Opinie i Recenzje ({reviews.length})</h2>

                {isUserLoggedIn ? (
                    <form className="review-form" onSubmit={handleSubmitReview}>
                        <h3>Dodaj swoją opinię</h3>

                        <div className="form-group">
                            <label>Ocena (1-5):</label>
                            <select
                                className="form-control"
                                value={newReview.rating}
                                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                                style={{ width: '160px' }}
                            >
                                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                <option value="4">⭐⭐⭐⭐ (4)</option>
                                <option value="3">⭐⭐⭐ (3)</option>
                                <option value="2">⭐⭐ (2)</option>
                                <option value="1">⭐ (1)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Komentarz:</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Napisz, jak Ci wyszło..."
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className="add-btn">Wyślij recenzję</button>
                    </form>
                ) : (
                    <div style={{ padding: '20px', background: '#f9f9f9', marginBottom: '20px' }}>
                        <Link to="/login">Zaloguj się</Link>, aby dodać opinię.
                    </div>
                )}

                <div className="reviews-list">
                    {reviews.length === 0 ? (
                        <p>Brak recenzji. Bądź pierwszy!</p>
                    ) : (
                        reviews.map((rev) => (
                            <div key={rev.id} className="review-card">
                                <div className="review-header">
                                    <span className="review-author">{rev.User ? rev.User.username : "Anonim"}</span>
                                    <span className="star-rating">
                                        {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                                    </span>
                                </div>
                                <p>{rev.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeDetails;