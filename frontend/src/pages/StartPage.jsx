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
                <h1>Witaj{user ? `, ${user.username}` : ''}! 👋</h1>
                <p>Co chcesz dzisiaj ugotować?</p>
            </header>

            <div className="dashboard-grid">
                <Link to="/fridge" className="dashboard-card">
                    <span className="card-icon">🧊</span>
                    <span className="card-title">Moja Lodówka</span>
                    <span>Zarządzaj produktami</span>
                </Link>

                <Link to="/recipes" className="dashboard-card">
                    <span className="card-icon">🍲</span>
                    <span className="card-title">Przepisy</span>
                    <span>Szukaj inspiracji</span>
                </Link>

                <Link to="/my-recipes" className="dashboard-card">
                    <span className="card-icon">📝</span>
                    <span className="card-title">Moje Przepisy</span>
                    <span>Twoja kolekcja</span>
                </Link>

                <Link to="/account" className="dashboard-card">
                    <span className="card-icon">⚙️</span>
                    <span className="card-title">Moje Konto</span>
                    <span>Ustawienia</span>
                </Link>
            </div>

            <button onClick={handleLogout} className="logout-btn">
                Wyloguj się
            </button>
        </div>
    );
};

export default StartPage;