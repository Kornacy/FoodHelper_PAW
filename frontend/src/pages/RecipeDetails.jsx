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
    <header className="details-header">
        <Link to="/start" className="back-link">
            ← Wróć do strony głównej
        </Link>
    </header>

    <div className="recipe-hero">
        <h1>{recipe.title}</h1>
        <p className="recipe-desc">{recipe.description}</p>
    </div>

    <div className="recipe-content-grid">
        <aside className="ingredients-card">
            <div className="card-header">
                <h3>Składniki</h3>
            </div>
            <div className="ingredients-list">
                {recipe.Products && recipe.Products.length > 0 ? (
                    <ul className="styled-list">
                        {recipe.Products.map(product => (
                            <li key={product.id} className="ingredient-item">
                                {console.log(product)}
                                <div className="ingredient-main">
                                    <strong>{product.name}</strong>
                                    <span className="ingredient-qty">
                                        {product.RecipeIngredient.quantity} {product.unit || 'szt/g'}
                                    </span>
                                </div>
                                <span className="ingredient-cal">
                                    {product.calories} kcal
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="empty-text">Brak informacji o składnikach.</p>
                )}
            </div>
        </aside>

        <section className="instructions-card">
            <div className="card-header">
                <h3>Sposób przygotowania</h3>
            </div>
            <div className="steps-text">
                {recipe.instruction}
            </div>
        </section>
    </div>

    <div className="reviews-section">
        <div className="reviews-header">
            <h2>Opinie i Recenzje <span className="count-badge">{reviews.length}</span></h2>
        </div>

        {isUserLoggedIn ? (
            <form className="review-form" onSubmit={handleSubmitReview}>
                <h3>Dodaj swoją opinię</h3>

                <div className="form-row">
                    <div className="form-group rating-group">
                        <label>Ocena</label>
                        <select
                            className="form-input"
                            value={newReview.rating}
                            onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                        >
                            <option value="5">5 - Doskonały</option>
                            <option value="4">4 - Bardzo dobry</option>
                            <option value="3">3 - Przeciętny</option>
                            <option value="2">2 - Słaby</option>
                            <option value="1">1 - Tragiczny</option>
                        </select>
                    </div>

                    <div className="form-group comment-group">
                        <label>Komentarz</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Podziel się wrażeniami..."
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="add-btn">Wyślij</button>
                </div>
            </form>
        ) : (
            <div className="login-prompt">
                <Link to="/login" className="login-link">Zaloguj się</Link>, aby dodać opinię.
            </div>
        )}

        <div className="reviews-list">
            {reviews.length === 0 ? (
                <div className="no-reviews">
                    <p>Brak recenzji. Bądź pierwszy!</p>
                </div>
            ) : (
                reviews.map((rev) => (
                    <div key={rev.id} className="review-card">
                        <div className="review-top">
                            <span className="review-author">{rev.User ? rev.User.username : "Użytkownik"}</span>
                            <span className="star-rating">
                                {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                            </span>
                        </div>
                        <p className="review-body">{rev.comment}</p>
                    </div>
                ))
            )}
        </div>
    </div>
</div>
    );
};

export default RecipeDetails;