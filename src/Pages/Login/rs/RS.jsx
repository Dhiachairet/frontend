import React, { useState, useEffect } from "react";
import Sidebar from "../../../component/Sidebar";
import "./rs.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode from jwt-decode

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import PublicationCard from "../publicationtest/PublicationCard";
const RS = () => {
  const [rs, setRs] = useState([]);
  const [formData, setFormData] = useState({
    articleNumber: "",
    title: "",
    journalTitle: "",
    publicationDate: "",
    authors: "",
    impactFactor: "",
    journalQuartile: "",
    volume: "",
    indexing: "",
    journalWebsite: "",
    doiLink: "",
  });

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Get JWT token from localStorage
      const decodedToken = jwtDecode(token); // Decode the token
      const userId = decodedToken.userId; // Get the user's ID from the decoded token

      try {
        if (decodedToken.role === "admin") {
          setIsAdmin(true);
          const response = await axios.get("http://localhost:3001/getAllRS", {
            headers: {
              Authorization: token,
            },
          });
          setRs(response.data);
        } else {
          const response = await axios.get("http://localhost:3001/getpub", {
            headers: {
              Authorization: token, // Send JWT token in request headers
              userId: userId, // Send the user ID in the request headers
            },
          });
          setRs(response.data);
        }
      } catch (error) {
        console.log("Error fetching Revues Scientifiques:", error);
      }
    };

    fetchData();
  }, []);

  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const toggleDeletePopup = () => {
    setShowDeletePopup(!showDeletePopup);
  };

  const toggleUpdatePopup = () => {
    setShowUpdatePopup(!showUpdatePopup);
  };
  const handleUpdateRs = (e) => {
    e.preventDefault();

    const {
      _id,
      articleNumber,
      title,
      journalTitle,
      publicationDate,
      authors,
      impactFactor,
      journalQuartile,
      volume,
      indexing,
      journalWebsite,
      doiLink,
    } = formData;
    axios
      .put(`http://localhost:3001/updateRS/${_id}`, {
        articleNumber,
        title,
        journalTitle,
        publicationDate,
        authors,
        impactFactor,
        journalQuartile,
        volume,
        indexing,
        journalWebsite,
        doiLink,
      })
      .then((result) => {
        console.log("rsfile updated successfully:", result.data);

        // Update the state with the updated data
        setRs(rs.map((item) => (item._id === _id ? result.data : item)));
        toggleUpdatePopup();
      })
      .catch((err) => console.error("Error updating rsfile:", err));
  };

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = (e) => {
    e.preventDefault();
    setShowPopup(!showPopup);
  };
  const handleAddpub = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get the JWT token from localStorage
    const decodedToken = jwtDecode(token); // Decode the token
    const userID = decodedToken.userID; // Get the user's ID from the decoded token

    try {
      const response = await axios.post(
        "http://localhost:3001/addpub",
        {
          ...formData,
          userId: userID, // Include the userId in the request data
        },
        {
          headers: {
            Authorization: token, // Send the token in the request headers
          },
        }
      );
      console.log("rsfile added successfully:", response.data);
      setShowPopup(false); // Close the popup after adding
      setRs([...rs, response.data]); // Add the new entry to the list without refreshing
    } catch (error) {
      console.error("Error adding rsfile:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };
  const [deleteId, setDeleteId] = useState(null);

  //delete rs
  const handleDeleteRs = (id) => {
    setShowDeletePopup(true); // Show the delete confirmation popup
    setDeleteId(id); // Set the ID of the entry to be deleted
  };
  const handleDeleteConfirmed = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:3001/deleteRS/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("rsfile deleted successfully:", response.data);
      setRs(rs.filter((item) => item._id !== id));
      setShowDeletePopup(false); // Close the delete popup
    } catch (error) {
      console.error("Error deleting rsfile:", error);
      // Handle the error
    }
  };
  const [importing, setImporting] = useState(false);
  const handleImportData = async () => {
    setImporting(true);
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userID = decodedToken.userID;
      const response = await axios.post("http://localhost:3001/profile", {
        token: token,
      });
      const dblplink = response.data.data.dblplink;

      // Trigger API call to import data from DBLP XML link
      const articleResponse = await axios.get(
        `http://localhost:3001/get_articles`,
        {
          params: {
            url: dblplink,
          },
        }
      );
      const articles = articleResponse.data.map((article) => ({
        title: Array.isArray(article.title)
          ? article.title.join(", ")
          : String(article.title),
        authors: Array.isArray(article.authors)
          ? article.authors.join(", ")
          : String(article.authors),
        journalTitle: Array.isArray(article.journalTitle)
          ? article.journalTitle.join(", ")
          : String(article.journalTitle),
        doiLink: Array.isArray(article.doiLink)
          ? article.doiLink.join(", ")
          : String(article.doiLink),
        publicationDate: Array.isArray(article.publicationDate)
          ? article.publicationDate.join(", ")
          : String(article.publicationDate),
        userID: userID, // Include the userID in each article object
      }));

      try {
        // Send articles to the new API endpoint for inserting articles
        console.log(userID);
        const insertResponse = await axios.post(
          "http://localhost:3001/insert_articles",
          {
            userID: userID,
            articles: articles,
          }
        );
        console.log("Articles inserted successfully:", insertResponse.data);

        // Update the state with the combined list of articles
        setRs((prevRs) => [...prevRs, ...articles]);
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    } catch (error) {
      console.error("Error importing data:", error);
    } finally {
      setImporting(false); // Reset importing state after import process
    }
  };

  return (
    <div className="rs-container">
      <Sidebar />
      <div className="rs-content">
        <h1>Revues Scientifiques</h1>
        <div className="divaddR">
          <button
            onClick={handleImportData}
            className="AddUR"
            disabled={importing}
          >
            {importing ? "Importing..." : "Import"}
          </button>
          <button onClick={togglePopup} className="AddUR">
            Ajouter+
          </button>
        </div>

        <div className="publication-list">
          {rs.map((entry) => (
            <div className="publication-card" key={entry._id}>
              <div className="edit-delete-container">
                <FontAwesomeIcon
                  icon={faPen}
                  className="edit-icon"
                  onClick={() => {
                    setFormData({
                      _id: entry._id,
                      articleNumber: entry.articleNumber,
                      title: entry.title,
                      journalTitle: entry.journalTitle,
                      publicationDate: entry.publicationDate,
                      authors: entry.authors,
                      impactFactor: entry.impactFactor,
                      journalQuartile: entry.journalQuartile,
                      volume: entry.volume,
                      indexing: entry.indexing,
                      journalWebsite: entry.journalWebsite,
                      doiLink: entry.doiLink,
                    });
                    toggleUpdatePopup();
                  }}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="delete-icon"
                  onClick={() => handleDeleteRs(entry._id)}
                />
              </div>
              <PublicationCard
                title={entry.title}
                authors={entry.authors}
                journal={entry.journalTitle}
                doi={entry.doiLink}
                impactFactor={entry.impactFactor}
                quartile={entry.journalQuartile}
                volume={entry.volume}
                indexing={entry.indexing}
                journalWebsite={entry.journalWebsite}
                publicationDate={entry.publicationDate}
              />
            </div>
          ))}
        </div>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <div className="icon">
              <FontAwesomeIcon icon={faXmark} onClick={togglePopup} />
            </div>
            <div className="SendM">Revues Scientifique:</div>
            <form className="user-form" onSubmit={handleAddpub}>
              <div className="input-group">
                <label htmlFor="articleNumber">Article N°:</label>
                <input
                  type="text"
                  id="articleNumber"
                  placeholder="Article N°"
                  value={formData.articleNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, articleNumber: e.target.value })
                  }
                />
                <label htmlFor="title">Titre:</label>
                <input
                  type="text"
                  id="title"
                  placeholder="Titre"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <label htmlFor="journalTitle">Titre du journal:</label>
                <input
                  type="text"
                  id="journalTitle"
                  placeholder="Titre du journal"
                  value={formData.journalTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, journalTitle: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="publicationDate">Date de Publication:</label>
                <input
                  type="date"
                  id="publicationDate"
                  placeholder="Date Publication"
                  value={formData.publicationDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publicationDate: e.target.value,
                    })
                  }
                />
                <label htmlFor="author">Auteur(s):</label>
                <input
                  type="text"
                  id="author"
                  placeholder="Nom de l'auteur"
                  value={formData.authors}
                  onChange={(e) =>
                    setFormData({ ...formData, authors: e.target.value })
                  }
                />

                <label htmlFor="impactFactor">Facteur d'impact:</label>
                <input
                  type="text"
                  id="impactFactor"
                  placeholder="Facteur d'impact"
                  value={formData.impactFactor}
                  onChange={(e) =>
                    setFormData({ ...formData, impactFactor: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="quartile">
                  Quartile du journal (Q1, Q2, Q3, Q4):
                </label>
                <input
                  type="text"
                  id="quartile"
                  placeholder="Quartile du journal (Q1, Q2, Q3, Q4)"
                  value={formData.journalQuartile}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      journalQuartile: e.target.value,
                    })
                  }
                />
                <label htmlFor="volume">Volume:</label>
                <input
                  type="text"
                  id="volume"
                  placeholder="Volume"
                  value={formData.volume}
                  onChange={(e) =>
                    setFormData({ ...formData, volume: e.target.value })
                  }
                />
                <label htmlFor="index">Indexation :</label>
                <input
                  type="text"
                  id="index"
                  placeholder="Indexation "
                  value={formData.indexing}
                  onChange={(e) =>
                    setFormData({ ...formData, indexing: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="journalSite">Site de la revue:</label>
                <input
                  type="text"
                  id="journalSite"
                  placeholder="Site de la revue"
                  value={formData.journalWebsite}
                  onChange={(e) =>
                    setFormData({ ...formData, journalWebsite: e.target.value })
                  }
                />
                <label htmlFor="doiLink">
                  Lien DOI de l'article scientifique:
                </label>
                <input
                  type="text"
                  id="doiLink"
                  placeholder="Lien DOI de l'article scientifique"
                  value={formData.doiLink}
                  onChange={(e) =>
                    setFormData({ ...formData, doiLink: e.target.value })
                  }
                />
              </div>

              <button className="save-button" type="submit">
                Ajout
              </button>
            </form>
          </div>
        </div>
      )}
      {showUpdatePopup && (
        <div className="popup">
          <div className="popup-inner">
            <div className="icon">
              <FontAwesomeIcon icon={faXmark} onClick={toggleUpdatePopup} />
            </div>
            <div className="SendM">Modifier Revues Scientifique:</div>
            <form className="user-form" onSubmit={handleUpdateRs}>
              <div className="input-group">
                <input
                  type="hidden"
                  id="_id"
                  value={formData._id}
                  onChange={(e) =>
                    setFormData({ ...formData, _id: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="articleNumber">Article N°:</label>
                <input
                  type="text"
                  id="articleNumber"
                  placeholder="Article N°"
                  value={formData.articleNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, articleNumber: e.target.value })
                  }
                />
                <label htmlFor="title">Titre:</label>
                <input
                  type="text"
                  id="title"
                  placeholder="Titre"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <label htmlFor="journalTitle">Titre du journal:</label>
                <input
                  type="text"
                  id="journalTitle"
                  placeholder="Titre du journal"
                  value={formData.journalTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, journalTitle: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="publicationDate">Date de Publication:</label>
                <input
                  type="date"
                  id="publicationDate"
                  placeholder="Date Publication"
                  value={formData.publicationDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publicationDate: e.target.value,
                    })
                  }
                />
                <label htmlFor="authors">Auteur(s):</label>
                <input
                  type="text"
                  id="authors"
                  placeholder="Auteur(s)"
                  value={formData.authors}
                  onChange={(e) =>
                    setFormData({ ...formData, authors: e.target.value })
                  }
                />
                <label htmlFor="impactFactor">Facteur d'impact:</label>
                <input
                  type="text"
                  id="impactFactor"
                  placeholder="Facteur d'impact"
                  value={formData.impactFactor}
                  onChange={(e) =>
                    setFormData({ ...formData, impactFactor: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="quartile">
                  Quartile du journal (Q1, Q2, Q3, Q4):
                </label>
                <input
                  type="text"
                  id="quartile"
                  placeholder="Quartile du journal (Q1, Q2, Q3, Q4)"
                  value={formData.journalQuartile}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      journalQuartile: e.target.value,
                    })
                  }
                />
                <label htmlFor="volume">Volume:</label>
                <input
                  type="text"
                  id="volume"
                  placeholder="Volume"
                  value={formData.volume}
                  onChange={(e) =>
                    setFormData({ ...formData, volume: e.target.value })
                  }
                />
                <label htmlFor="index">Idexation:</label>
                <input
                  type="text"
                  id="index"
                  placeholder="Idexation"
                  value={formData.indexing}
                  onChange={(e) =>
                    setFormData({ ...formData, indexing: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="journalSite">Site de la revue:</label>
                <input
                  type="text"
                  id="journalSite"
                  placeholder="Site de la revue"
                  value={formData.journalWebsite}
                  onChange={(e) =>
                    setFormData({ ...formData, journalWebsite: e.target.value })
                  }
                />
                <label htmlFor="doiLink">
                  Lien DOI de l'article scientifique:
                </label>
                <input
                  type="text"
                  id="doiLink"
                  placeholder="Lien DOI de l'article scientifique"
                  value={formData.doiLink}
                  onChange={(e) =>
                    setFormData({ ...formData, doiLink: e.target.value })
                  }
                />
              </div>
              <button className="save-button" type="submit">
                Modifier
              </button>
            </form>
          </div>
        </div>
      )}
      {showDeletePopup && (
        <div className="popup">
          <div className="popup-inner">
            <div className="icon">
              <FontAwesomeIcon icon={faXmark} onClick={toggleDeletePopup} />
            </div>
            <div className="SendM">
              Êtes-vous sûr de vouloir supprimer cette Journal ?
            </div>
            <br />
            <div className="button-group">
              <button
                className="cancel-button"
                onClick={() => setShowDeletePopup(false)}
              >
                Annuler
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteConfirmed(deleteId)}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default RS;
