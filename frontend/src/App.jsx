import { Routes, Route } from 'react-router-dom';
import Recipes from './pages/Recipes';
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeDetails from './pages/RecipeDetails';
import StartPage from './pages/StartPage';
import Fridge from './pages/Fridge';
import './App.css';

function App() {
  return (
    <div className="App">
       <Routes>
         <Route path="/" element={<MainPage />}></Route>
         <Route path='/login' element={<Login/>}></Route>
         <Route path='/recipes' element={<Recipes/>}></Route>
         <Route path='/register' element={<Register/>}></Route>
         <Route path="/recipes/:id" element={<RecipeDetails />}></Route>
         <Route path="/start" element={<StartPage />}></Route>
         <Route path="/fridge" element={<Fridge />}></Route>
       </Routes>
    </div>
  );
}

export default App;