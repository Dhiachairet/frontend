import React, { useState } from "react";
import "./pubtest.css";
import PropTypes from "prop-types";
import Sidebar from "../../../component/Sidebar";

const PublicationCard = (props) => {
  const [isAbstractVisible, setIsAbstractVisible] = useState(false);

  const toggleAbstractVisibility = () => {
    setIsAbstractVisible(!isAbstractVisible);
  };

  return (
    <>
    <div >
    
      
      <h2 className="publication-title">{props.title}</h2>
      <p className="publication-journal">
        <strong>Titre du journal:</strong> {props.journal}
      </p>
      <p className="publication-authors">
        <strong>Auteur(s):</strong> {props.authors}
      </p>
    
      <p className="publication-doi">
        <strong>Lien DOI:</strong>{" "}
        <a href={props.doi} target="_blank" rel="noopener noreferrer">
          {props.doi}
        </a>
      </p>
      <button
        className="toggle-abstract-btn"
        onClick={toggleAbstractVisibility}
      >
        {isAbstractVisible ? " Voir moins" : "Voir plus"}
      </button>
      {isAbstractVisible && (
        <div className="publication-details">
          <p>
            <strong>Facteur d'impact:</strong> {props.impactFactor}
          </p>
          <p>
            <strong>Quartile du journal:</strong> {props.quartile}
          </p>
          <p>
            <strong>Volume:</strong> {props.volume}
          </p>
          <p>
            <strong>Idexation:</strong> {props.indexing}
          </p>
          <p>
            <strong>Site de la revue:</strong> {props.journalWebsite}
          </p>
          <p>
            <strong>Date de Publication</strong> {props.publicationDate}
          </p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
    
    </>
  );
};

PublicationCard.propTypes = {
  title: PropTypes.string.isRequired,
  authors: PropTypes.string.isRequired,
  journal: PropTypes.string.isRequired,
  doi: PropTypes.string.isRequired,
  impactFactor: PropTypes.string.isRequired,
  quartile: PropTypes.string.isRequired,
  volume: PropTypes.string.isRequired,
  indexing: PropTypes.string.isRequired,
  journalWebsite: PropTypes.string.isRequired,
  publicationDate: PropTypes.string.isRequired,
};


export default PublicationCard;
