import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StartPage.css';

const StartPage = () => {
    const navigate = useNavigate();

    const [user] = useState(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (e) {
                return e.message;
            }
        }
        return null;
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/'); 
    };

    return (
       <div className="dashboard-container">
    <header className="dashboard-header">
        <div className="header-text">
            <h1>Witaj{user ? `, ${user.username}` : ''}</h1>
            <p>Co chcesz dzisiaj ugotować?</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
            Wyloguj się
        </button>
    </header>

    <div className="dashboard-grid">
        <Link to="/fridge" className="dashboard-card card-fridge">
            <div className="card-content">
                <span className="card-title">Moja Lodówka</span>
                <span className="card-desc">Zarządzaj produktami</span>
            </div>
        </Link>

        <Link to="/recipes" className="dashboard-card card-recipes">
            <div className="card-content">
                <span className="card-title">Przepisy</span>
                <span className="card-desc">Szukaj inspiracji</span>
            </div>
        </Link>

        <Link to="/my-recipes" className="dashboard-card card-personal">
            <div className="card-content">
                <span className="card-title">Moje Przepisy</span>
                <span className="card-desc">Twoja kolekcja</span>
            </div>
        </Link>

        <Link to="/account" className="dashboard-card card-account">
            <div className="card-content">
                <span className="card-title">Moje Konto</span>
                <span className="card-desc">Ustawienia</span>
            </div>
        </Link>
    </div>
</div>
    );
};

export default StartPage;