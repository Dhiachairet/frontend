import React, { useState } from "react";
import "./pubtest.css";
import PropTypes from "prop-types";


const PublicationCardconf = (props) => {
  const [isAbstractVisible, setIsAbstractVisible] = useState(false);

  const toggleAbstractVisibility = () => {
    setIsAbstractVisible(!isAbstractVisible);
  };

  return (
    <>
      <div>
        
        <h2 className="publication-title">{props.publicationtitle}</h2>
        <p className="publication-authors">
          <strong>Auteur(s):</strong> {props.authors}
        </p>
        <p className="publication-conferencetitle">
          <strong>Titre de la conférence:</strong> {props.conferencetitle}
        </p>
        <p className="publication-conferencesite">
          <strong>Site de la conférence:</strong> {props.conferencesite}
        </p>
        <button
        className="toggle-abstract-btn"
        onClick={toggleAbstractVisibility}
      >
        {isAbstractVisible ? " Voir moins" : "Voir plus"}
      </button>
       
        {isAbstractVisible && (
          <div className="publication-details">
            <p className="publication-editor">
          <strong>Editeur:</strong> {props.editor}
        </p>
        <p className="publication-editorlink">
          <strong>Lien editeur:</strong>{" "}
          <a href={props.editorlink} target="_blank" rel="noopener noreferrer">
            {props.editorlink}
          </a>
        </p>
        <p className="publication-edition">
          <strong>Edition:</strong> {props.edition}
        </p>
        <p className="publication-isbn">
          <strong>ISBN/Issn:</strong> {props.isbn}
        </p>
        <p className="publication-pubdata">
          <strong>Date de publication:</strong> {props.pubdata}
        </p>
        
          </div>
        )}
      </div>
    </>
  );
};

PublicationCardconf.propTypes = {
  publicationtitle: PropTypes.string.isRequired,
  authors: PropTypes.string.isRequired,
  conferencetitle: PropTypes.string.isRequired,
  conferencesite: PropTypes.string.isRequired,
  editor: PropTypes.string.isRequired,
  editorlink: PropTypes.string.isRequired,
  edition: PropTypes.string.isRequired,
  isbn: PropTypes.string.isRequired,
  pubdata: PropTypes.string.isRequired,
};

export default PublicationCardconf;
