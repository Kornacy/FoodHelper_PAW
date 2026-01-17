import { useEffect, useState } from "react"; 
import {getPublicRecipes} from '../services/recipeService';

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
                            {/* Tu możesz dodać więcej pól, np. opis */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default Home;