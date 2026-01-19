import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Account.css';

const Account = ({ user, setUser }) => {
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    if (!user) {
        return <div className="account-container">Ładowanie danych użytkownika...</div>;
    }

    return (
        <div className="account-container">
            <div className="account-card">
                <div className="account-header">
                    <h1>Twój Profil</h1>
                </div>
                
                <div className="account-details">
                    <div className="detail-item">
                        <label>Nazwa użytkownika:</label>
                        <span>{user.username}</span>
                    </div>
                    
                    <div className="detail-item">
                        <label>Adres Email:</label>
                        <span>{user.email}</span>
                    </div>

                    <div className="detail-item">
                        <label>Rola:</label>
                        <span className="role-badge">{user.role || 'Użytkownik'}</span>
                    </div>
                </div>

                <div className="account-actions">
                    <Link to="/my-recipes" className="action-btn secondary">
                        Moje Przepisy
                    </Link>
                    
                    <button onClick={handleLogout} className="action-btn logout">
                        Wyloguj się
                    </button>
                </div>
            </div>
            
            <div style={{marginTop: '20px', textAlign: 'center'}}>
                <Link to="/start">← Wróć do strony głównej</Link>
            </div>
        </div>
    );
};

export default Account;