import React, { useState } from 'react';
import {useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import './login.css'; 
import { Link } from 'react-router-dom';

 function Login() {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/login', { email, password })
      .then(result => {
        if (result.data.status === "ok") {
          localStorage.setItem("token", result.data.data);
          console.log("token saved:", localStorage.getItem("token"));
          alert("Succès !");
          navigate('/profile');
        }
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.error) {
          setErrorMessage(err.response.data.error);
        } else {
          setErrorMessage("Erreur de connexion");
        }
        console.log(err);
      });
  };
  
  return (
    <div className="login-container">
      <div className="card-containerL">
        <div className="left-panelL">
          <h2 className="headingL">Se connecter à</h2>
          <p className="subheadingL">Votre compte</p>
        </div>
        <div className="right-panelL">
          <div >
          {location.state && location.state.message && (
            <div className="message">
              {location.state.message}
            </div>
          )}
            <h2 >Bienvenue</h2>
            <div >
              <span>Pas de compte?</span>
              <Link to="/register" style={{ textDecoration: 'none' }}>
              Inscrivez-vous
              </Link>
            </div>
          </div>
          <h1 className="headingL">Se connecter </h1>
          {errorMessage && (
            <div className="error-messageL">{errorMessage}</div>
          )}

          
          <form onSubmit={handleSubmit} className="form-groupL">
            <div className="form-groupL">
              <label className="form-labelL" htmlFor="username">
              Saisissez votre adresse e-mail
              </label>
              <input
                className="form-inputL"
                id="username"
                placeholder="Adresse e-mail"
                type="text"
                onChange={(e) =>setEmail(e.target.value)}
              />
            </div>
            <div className="form-groupL">
              <label className="form-labelL" htmlFor="password">
              Saisissez votre mot de passe
              </label>
              <input
                className="form-inputL"
                id="password"
                placeholder="Mot de passe"
                type="password"
                onChange={(e) =>setPassword(e.target.value)}
              />
            </div>
            
            <div >
            
            
              <button className="sign-in-btnL" type="submit">
              Connexion
              </button>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;