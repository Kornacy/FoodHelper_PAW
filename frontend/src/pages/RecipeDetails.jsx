import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams to klucz do sukcesu
import { getRecipeDetails } from '../services/recipeService';

const RecipeDetails = () => {
    const { id } = useParams(); // Wyciągamy 'id' z adresu URL (np. /recipes/5)
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const data = await getRecipeDetails(id);
                setRecipe(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Nie udało się pobrać szczegółów przepisu.");
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]); 

    if (loading) return <p>Ładowanie szczegółów...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!recipe) return <p>Nie znaleziono przepisu.</p>;

    return (
        <div style={{ padding: '20px' }}>
            <Link to="/recipes">← Powrót do listy</Link>
            
            <h1>{recipe.title}</h1>

            <p>{recipe.description}</p>
            
            <h3>Składniki:</h3>
            <p>{recipe.ingredients}</p> 

            <h3>Instrukcja:</h3>
            <p>{recipe.steps}</p>
        </div>
    );
};

export default RecipeDetails;