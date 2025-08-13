import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Register.css';

function Register() {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/userlist/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstname, lastname, email, password }),
            });

            if (!response.ok) {
                // throw new Error('Registration failed');
                const { message } = await response.json();
                throw new Error(message);
            }

            alert("Registration successful. Please go back login page.");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="body-background">
            <div className="register-form">
                <p className="form-title">Cartoonopia</p>
                <p className="form-subtitle">The home of characters and cartoons!</p>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-block">
                        <input
                            type="text"
                            id="firstname"
                            className="input-field"
                            placeholder="First Name"
                            value={firstname}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-block">
                        <input
                            type="text"
                            id="lastname"
                            className="input-field"
                            placeholder="Last Name"
                            value={lastname}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-block">
                        <input
                            type="email"
                            id="email"
                            className="input-field"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-block">
                        <input
                            type="password"
                            id="password"
                            className="input-field"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="input-block">
                        <button type="submit" className="register-submit">Sign Up</button>
                    </div>
                </form>
                <p className="register-bottom">Already have an account? <Link to="/login">Sign in</Link></p>
            </div>
        </div>
    );
}

export default Register;