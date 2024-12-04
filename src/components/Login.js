// Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://reqres.in/api/login', {
        email,
        password,
      });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token); 
      window.location.href = '/users';
    } catch (error) {
      setError(error.message);
      alert("Use Mail: eve.holt@reqres.in , Use Password: cityslicka ")
    }
  };

  return (
    <div class='login'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor='email'>
            Email:
          </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name='email' />
        </div>


        <div>
          <label htmlFor='password'>
            Password:
          </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name='password' />

        </div>

        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;