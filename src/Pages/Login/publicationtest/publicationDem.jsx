import React, { useState } from "react";
import "./pubtest.css";
import PropTypes from "prop-types";

const PublicationDem = (props) => {
 

  return (
    <div className="publication-dem-container">
      <h2>Demand Details</h2>
      <div className="publication-dem-content">
        <p><strong>Nom et Prénom:</strong> {props.name}</p>
        <div className="equiment-demandee">
        <p><strong>Equipement Demandé:</strong></p>
        <div className="equipement-text">{props.equipement}</div>

        </div>
        
        <p><strong>Période d’Utilisation (Début):</strong> {props.debut}</p>
        <p><strong>Période d’Utilisation (Fin):</strong> {props.fin}</p>
      </div>
    </div>
  );
};

PublicationDem.propTypes = {
  name: PropTypes.string.isRequired,
  equipement: PropTypes.string.isRequired,
  debut: PropTypes.string.isRequired,
  fin: PropTypes.string.isRequired,
};

export default PublicationDem;
