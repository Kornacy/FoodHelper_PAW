import { useEffect, useState } from "react"; 
import {getPublicRecipes} from '../services/recipeService';
import { Link } from 'react-router-dom'
const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() =>{
        const getData = async() =>{
            try{
                const recdata = await getPublicRecipes();
                console.log(recdata);
                setRecipes(recdata);
                setLoading(false);
            }
            catch(err){
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        }
        getData();
    }, []);
    if (loading) return <p>Ładowanie przepisów...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    return (
        <div>
            <h1>Lista Przepisów</h1>
            {recipes.length === 0 ? (
                <p>Brak przepisów w bazie.</p>
            ) : (
                <ul>
                    {recipes.map((recipe) => (
                        <li key={recipe.id}>
                            <strong>{recipe.title}</strong>
                            <div style={{ marginTop: '5px' }}>
                                <Link to={`/recipes/${recipe.id}`}>
                                    <button style={{ cursor: 'pointer' }}>
                                        Zobacz szczegóły
                                    </button>
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default Home;