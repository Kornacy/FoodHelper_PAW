import React, {useState, useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';
import Recipes from './pages/PublicRecipes';
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeDetails from './pages/RecipeDetails';
import StartPage from './pages/StartPage';
import Fridge from './pages/Fridge';
import MyRecipes from './pages/MyRecipes';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import ProtectedRoute from './components/ProtectedRoute';
import api from "./services/api";
import Account from './pages/Account';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return; 
      }
      try {
        const res = await api.get('/api/me'); 
        setUser(res.data.user);
      } catch (err) {
        console.log("Błąd autoryzacji (np. wygasły token)", err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="App">
       <Routes>
         <Route path="/" element={<MainPage />}></Route>
         <Route path='/login' element={<Login setUser={setUser}/>}></Route>
         <Route path='/recipes' element={<Recipes/>}></Route>
         <Route path='/register' element={<Register/>}></Route>
         <Route element={<ProtectedRoute user={user} loading={loading} />}>
         <Route path="/recipes/:id" element={<RecipeDetails />}></Route>
         <Route path="/start" element={<StartPage />}></Route>
         <Route path="/fridge" element={<Fridge />}></Route>
         <Route path='/my-recipes' element={<MyRecipes/>}></Route>
         <Route path='/add-recipe' element={<AddRecipe/>}></Route>
         <Route path="/edit-recipe/:id" element={<EditRecipe />}></Route>
         <Route path="/account" element={<Account user={user} setUser={setUser} />} />
         </Route>
       </Routes>
    </div>
  );
}

export default App;