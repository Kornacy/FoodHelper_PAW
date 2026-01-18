import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import './Login.css';

const Register = () => {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);


        if (formData.password !== formData.confirmPassword) {
            setError("Hasła nie są identyczne!");
            return;
        }

        try {
            await registerUser({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            
            alert("Konto założone! Możesz się zalogować.");
            navigate('/login'); 
        } catch (err) {
            setError(err.response?.data?.message || "Błąd rejestracji");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-box">
                <h2 className="auth-title">Załóż konto</h2>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nazwa użytkownika</label>
                        <input 
                            type="text" 
                            name="username"
                            className="form-input"
                            value={formData.username}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Hasło</label>
                        <input 
                            type="password" 
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Potwierdź hasło</label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            className="form-input"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <button type="submit" className="auth-btn">Zarejestruj się</button>
                </form>

                <p className="auth-link">
                    Masz już konto? <Link to="/login">Zaloguj się</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;