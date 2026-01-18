import React  from "react";
import { Link } from "react-router-dom";
import './MainPage.css'

const MainPage = () =>{
    return (
        <div className="landing-container">
      <h1 className="hero-title">FoodHelper 🥦</h1>
      <p className="hero-description">
        Twoja osobista książka kucharska i asystent zakupowy. 
        Planuj posiłki, sprawdzaj przepisy i marnuj mniej jedzenia!
      </p>

      <div className="button-group">

        <Link to="/recipes" className="btn btn-primary">
          🍽️ Zobacz Przepisy
        </Link>


        <Link to="/login" className="btn btn-secondary">
          Zaloguj się
        </Link>


        <Link to="/register" className="btn btn-outline">
          Załóż konto
        </Link>
      </div>
    </div>
    )
};
export default MainPage;