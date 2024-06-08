import './register.css'; // Import the CSS file
import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate } from "react-router-dom";


 function Register() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    role: ''
  });

  const navigate = useNavigate()
const [message, setMessage] = useState('');
const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.name || !formData.phone || !formData.password || !formData.role) {
      setError('Vous devez remplir toutes les informations.');
      return;
    }
   
   axios.post('http://localhost:3001/register', formData)
   .then(result =>{ 
    console.log(result)

   navigate('/login', {state:{ message: 'Votre demande a été envoyée à l\'administrateur.'} });
  })
   .catch(err=>console.log(err));
  };
 

  
    return(
        <div className="signup-containerR">
      <div className="card-containerR">
        <div className="left-panelR">
          <h2 className="headingR">S'inscrire à</h2>
          <p className="subheadingR">Votre compte</p>
        </div>
        <div className="right-panelR">
          <h1 className="headingR">S'inscrire</h1>
          <form onSubmit={handleSubmit} className="form-groupR">
          {error && <p className="error-message">{error}</p>}
            <div className="form-groupR">
              <label className="form-labelR" htmlFor="email">
              Saisissez votre adresse e-mail
              </label>
              <input
                className="form-inputR"
                id="email"
                placeholder="Adresse e-mail"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="form-groupR">
              <label className="form-labelR" htmlFor="firstName">
              Saisissez votre prénom et votre nom de famille
              </label>
              <input
                className="form-inputR"
                id="firstlastName"
                placeholder="Prénom et nom"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
           
            <div className="form-groupR">
              <label className="form-labelR" htmlFor="PhoneNumber">
              Entrez votre numéro de téléphone
              </label>
              <input
                className="form-inputR"
                id="PhoneNumber"
                placeholder="N° de téléphone"
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="form-groupR">
              <label className="form-labelR" htmlFor="password">
              Entrez votre mot de passe
              </label>
              <input
                className="form-inputR"
                id="password"
                placeholder="mot de passe"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          
            <div className="form-groupR">
              <label className="form-labelR" htmlFor="role">
              S'inscrire comme :
              </label>
              <select
                className="form-inputR"
                id="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                 <option value="">Sélectionner un rôle</option>
                <option value="Professeur">Professeur</option>
                <option value="Master">Master</option>
                <option value="Doctorant">Doctorant</option>
              </select>
            </div>
           
            
            
            <button className="sign-up-btnR" type="submit">
            inscription
            </button>
            
          </form>
        </div>
      </div>
    </div>

    );
 }
 export default Register;