import React from "react";
import { Link } from "react-router-dom";
import "./home.css"
import logo from './logopfee.png'; 


const Home = () => {
  return (
    <>
      <section>
        <header>
        <div className="sidebar-logo-container">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>
          <ul>
            <li>
             Home
            </li>
            <li>
            <a href="#contact">Contact</a>
            </li>
          </ul>
          <button className="login-link">
          <Link to="/login" style={{ textDecoration: 'none', color: '#11101d', transition: 'color 0.2s', }}
          onMouseOver={(e) => (e.target.style.color = 'white')} // Change color on hover
          onMouseOut={(e) => (e.target.style.color = '#11101d')} >Se connecter</Link>

          </button>
          <button className="login-link">
          <Link to="/register" style={{ textDecoration: 'none', color: '#11101d',transition: 'color 0.2s', }}
          onMouseOver={(e) => (e.target.style.color = 'white')} // Change color on hover
          onMouseOut={(e) => (e.target.style.color = '#11101d')} >Créer Votre compte</Link>
          </button>
        </header>
        <div class="circlesH"></div>
        <div className="textdesH">
          <h1>IResCoMath</h1>
         
          <p className="paragraphH">
            Le Laboratoire de Recherche Hatem Bettahar IRESCOMATH (LR20ES11)
            est crée en 2020 à la Faculté des Sciences de Gabès (FSG). Ce
            laboratoire est une évolution de l'Unité de Recherche Hatem
            Bettahar IRESCOMATH (UR13ES79) qui a été créée en 2013 à la FSG
            dans l'objectif d'offrir un cadre de recherche dans le domaine des
            TIC pour les jeunes chercheurs de la région du sud et renforcer
            les collaborations et les échanges avec les équipes nationales et
            internationales...
          </p>
        </div>
      </section>
      <body>
       
        <div className="aboutH">
          <div className="cardsH">
            <h1>Comment utiliser ?</h1>
            <div className="boxH">
              <div className="cardH">
                <p>Rejoignez la plateforme</p>
              </div>
              <div className="cardH">
                <p>Complétez le formulaire</p>
              </div>
              <div className="cardH">
                <p>Obtenez votre service</p>
              </div>
            </div>
          </div>
        </div>
      </body>
      <footer id="contact" className="footerH">
        <div className="mainH">
          <div className="rowH">
          <div className="footer_col">
              <h4>Propos</h4>
              <ul>
                <li>
                DIRECTRICE DU LABORATOIRE DE RECHERCHE: <br />
                MCF.TOUATI Haifa
                </li>
                <li>FSG, Cité Erriadh 6072 Zrig Gabès Tunisie</li>
              </ul>
            </div>
            <div className="footer_col">
              <h4>Contact</h4>
              <ul>
                <li>Email: haifa.touati@univqb.tn</li>
                <li>Tél: +216 75 392 100</li>
                <li>Fax: +216 75 392 190</li>
                <li>SiteWeb: <a href="http://www.fsq.rnu.tn">www.fsq.rnu.tn</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
