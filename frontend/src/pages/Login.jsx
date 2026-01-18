import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await login({ email, password });
            localStorage.setItem('token', response.token); 
            localStorage.setItem('user', JSON.stringify(response.user));
            console.log(`response.user: ${response.user} response.token: ${response.token}`)
            console.log(`response: ${response}`)
            console.log(response)
            alert("Zalogowano pomyślnie!"); 
            navigate('/start'); 
        } catch (err) {

            setError(err.response?.data?.message || "Błąd logowania");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-box">
                <h2 className="auth-title">Zaloguj się</h2>
                
                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Hasło</label>
                        <input 
                            type="password" 
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="auth-btn">Zaloguj się</button>
                </form>

                <p className="auth-link">
                    Nie masz konta? <Link to="/register">Zarejestruj się</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;