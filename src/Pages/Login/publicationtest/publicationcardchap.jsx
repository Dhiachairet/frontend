import React, { useState } from "react";
import "./pubtest.css";
import PropTypes from "prop-types";
import Sidebar from "../../../component/Sidebar";

const PublicationCardchap = (props) => {
  const [isAbstractVisible, setIsAbstractVisible] = useState(false);

  const toggleAbstractVisibility = () => {
    setIsAbstractVisible(!isAbstractVisible);
  };

  const { chapterNumber, title, authors, publisher, publisherLink, edition, isbn, publicationDate } = props;

  return (
    <>
      <div>
        <Sidebar />
        <h2 className="publication-title">{title}</h2>
        <p className="publication-authors">
          <strong>Auteur(s):</strong> {authors}
        </p>
        <p className="publication-publisher">
          <strong>Éditeur:</strong> {publisher}
        </p>
        <p className="publication-publisherlink">
          <strong>Lien éditeur:</strong>{" "}
          <a href={publisherLink} target="_blank" rel="noopener noreferrer">
            {publisherLink}
          </a>
        </p>
       
        <button className="toggle-abstract-btn" onClick={toggleAbstractVisibility}>
          {isAbstractVisible ?" Voir moins" : "Voir plus"}
        </button>
        {isAbstractVisible && (
          <div className="publication-details">
             <p className="publication-edition">
          <strong>Édition:</strong> {edition}
        </p>
        <p className="publication-isbn">
          <strong>ISBN/Issn:</strong> {isbn}
        </p>
        <p className="publication-publicationdate">
          <strong>Date de publication:</strong> {publicationDate}
        </p>
            {/* Add more details as needed */}
          </div>
        )}
      </div>
    </>
  );
};

PublicationCardchap.propTypes = {
  chapterNumber: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  authors: PropTypes.string.isRequired,
  publisher: PropTypes.string.isRequired,
  publisherLink: PropTypes.string.isRequired,
  edition: PropTypes.string.isRequired,
  isbn: PropTypes.string.isRequired,
  publicationDate: PropTypes.string.isRequired,
};

export default PublicationCardchap;
