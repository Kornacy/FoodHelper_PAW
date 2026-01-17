import { Routes, Route } from 'react-router-dom';
import Recipes from './pages/recipes';
import MainPage from './pages/MainPage';
import './App.css';

function App() {
  return (
    <div className="App">
       <Routes>
         <Route path="/" element={<MainPage />} />
         <Route path='/login' element={<p>Logowanie</p>}></Route>
         <Route path='/recipes' element={<Recipes/>}></Route>
       </Routes>
    </div>
  );
}

export default App;