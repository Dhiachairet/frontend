import Sidebar from "../../../component/Sidebar";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./conference.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import PublicationCardconf from "../publicationtest/publicationcardconf";
const Conference = () => {
  const [conferences, setConferences] = useState([]);
  const [formData, setFormData] = useState({
    articleNumber: "",
    publicationtitle: "",
    authors: "",
    conferencetitle: "",
    conferencesite: "",
    editor: "",
    editorlink: "",
    edition: "",
    isbn: "",
    pubdata: "",
  });

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Get JWT token from localStorage
      const decodedToken = jwtDecode(token); // Decode the token
      const userId = decodedToken.userId;
      try {
        if (decodedToken.role === "admin") {
          setIsAdmin(true);
          const response = await axios.get("http://localhost:3001/getAllconf", {
            headers: {
              Authorization: token, // Send JWT token in request headers
              userId: userId, // Send the user ID in the request headers
            },
          });
          setConferences(response.data);
        } else {
          const response = await axios.get("http://localhost:3001/getconf", {
            headers: {
              Authorization: token, // Send JWT token in request headers
              userId: userId, // Send the user ID in the request headers
            },
          });
          setConferences(response.data);
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
  const handleUpdateConf = (e) => {
    e.preventDefault();
    const {
      _id,
      articleNumber,
      publicationtitle,
      authors,
      conferencetitle,
      conferencesite,
      editor,
      editorlink,
      edition,
      isbn,
      pubdata,
    } = formData;
    axios
      .put(`http://localhost:3001/updateconf/${_id}`, {
        articleNumber,
        publicationtitle,
        authors,
        conferencetitle,
        conferencesite,
        editor,
        editorlink,
        edition,
        isbn,
        pubdata,
      })
      .then((result) => {
        console.log("cfile updated successfully:", result.data);

        setConferences(
          conferences.map((item) => (item._id === _id ? result.data : item))
        );
        toggleUpdatePopup();
      })
      .catch((err) => console.error("Error updating rsfile:", err));
  };

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = (e) => {
    e.preventDefault();
    setShowPopup(!showPopup);
  };

  const handleAddConf = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get the JWT token from localStorage
    const decodedToken = jwtDecode(token); // Decode the token
    const userID = decodedToken.userID; // Get the user's ID from the decoded token

    try {
      const response = await axios.post(
        "http://localhost:3001/addconf",
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
      console.log("cfile added successfully:", response.data);
      setShowPopup(false); // Close the popup after adding
      setConferences([...conferences, response.data]); // Add the new conf to the list without refreshing
    } catch (error) {
      console.error("Error adding cfile:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };
  const [deleteId, setDeleteId] = useState(null);

  //delete conf
  const handleDeleteConf = (id) => {
    setShowDeletePopup(true); // Show the delete confirmation popup
    setDeleteId(id); // Set the ID of the conf to be deleted
  };
  const handleDeleteConfirmed = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:3001/deleteconf/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("conffile deleted successfully:", response.data);
      setConferences(conferences.filter((item) => item._id !== id));
      setShowDeletePopup(false); // Close the delete popup
    } catch (error) {
      console.error("Error deleting conffile:", error);
      // Handle the error
    }
  };
  const [importing, setImporting] = useState(false);
  const handleImportData = async () => {
    setImporting(true); // Set importing state to true during import process

    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userID = decodedToken.userID;
      const response = await axios.post("http://localhost:3001/profile", {
        token: token,
      });
      const dblplink = response.data.data.dblplink;

      // Trigger API call to import data from DBLP XML link
      const confResponse = await axios.get(
        `http://localhost:3001/get_inproceedings`,
        {
          params: {
            url: dblplink,
          },
        }
      );
      const confe = confResponse.data.map((inproceeding) => ({
        publicationtitle: Array.isArray(inproceeding.publicationtitle)
          ? inproceeding.publicationtitle.join(", ")
          : String(inproceeding.publicationtitle),
        authors: Array.isArray(inproceeding.authors)
          ? inproceeding.authors.join(", ")
          : String(inproceeding.authors),
        conferencetitle: Array.isArray(inproceeding.conferencetitle)
          ? inproceeding.conferencetitle.join(", ")
          : String(inproceeding.conferencetitle),
        editorlink: Array.isArray(inproceeding.editorlink)
          ? inproceeding.editorlink.join(", ")
          : String(inproceeding.editorlink),
        pubdata: Array.isArray(inproceeding.pubdata)
          ? inproceeding.pubdata.join(", ")
          : String(inproceeding.pubdata),
        userID: userID,
      }));
      try {
        // Send articles to the new API endpoint for inserting articles
        console.log(userID);
        const insertResponse = await axios.post(
          "http://localhost:3001/insert_inproceeding",
          {
            userID: userID,
            confe: confe,
          }
        );
        console.log("conference inserted successfully:", insertResponse.data);
        setConferences((preConf) => [...preConf, ...confe]); // Update the state with the inserted articles
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
    <div className="c-container">
      <Sidebar />
      <div className="c-content">
        <h1>Conférences</h1>
        <div className="divaddC">
          <button
            onClick={handleImportData}
            className="AddUR"
            disabled={importing}
          >
            {importing ? "Importing..." : "Import"}
          </button>
          <button onClick={togglePopup} className="AddC">
            Ajouter+
          </button>
        </div>
        <div className="publication-list">
          {conferences.map((conf) => (
            <div className="publication-card" key={conf._id}>
              <div className="edit-delete-container">
                <FontAwesomeIcon
                  icon={faPen}
                  className="edit-icon"
                  onClick={() => {
                    setFormData({
                      _id: conf._id,
                      articleNumber: conf.articleNumber,
                      publicationtitle: conf.publicationtitle,
                      authors: conf.authors,
                      conferencetitle: conf.conferencetitle,
                      conferencesite: conf.conferencesite,
                      editor: conf.editor,
                      editorlink: conf.editorlink,
                      edition: conf.edition,
                      isbn: conf.isbn,
                      pubdata: conf.pubdata,
                    });
                    toggleUpdatePopup();
                  }}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="delete-icon"
                  onClick={() => handleDeleteConf(conf._id)}
                />
              </div>
              <PublicationCardconf
                publicationtitle={conf.publicationtitle}
                authors={conf.authors}
                conferencetitle={conf.conferencetitle}
                conferencesite={conf.conferencesite}
                editor={conf.editor}
                editorlink={conf.editorlink}
                edition={conf.edition}
                isbn={conf.isbn}
                pubdata={conf.pubdata}
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
            <div className="SendM">Conférences:</div>
            <form className="user-form" onSubmit={handleAddConf}>
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
                <label htmlFor="title">Titre de Publication:</label>
                <input
                  type="text"
                  id="title"
                  placeholder="Titre de Publication"
                  value={formData.publicationtitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publicationtitle: e.target.value,
                    })
                  }
                />
                <label htmlFor="authors">Auteur(s):</label>
                <input
                  type="text"
                  id="authors"
                  placeholder="Auteurs"
                  value={formData.authors}
                  onChange={(e) =>
                    setFormData({ ...formData, authors: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="confTitle">Titre de la conférence:</label>
                <input
                  type="text"
                  id="confTitle"
                  placeholder="Titre de la conférence"
                  value={formData.conferencetitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      conferencetitle: e.target.value,
                    })
                  }
                />
                <label htmlFor="confSite">Site de la conférence:</label>
                <input
                  type="text"
                  id="confSite"
                  placeholder="Site de la conférence"
                  value={formData.conferencesite}
                  onChange={(e) =>
                    setFormData({ ...formData, conferencesite: e.target.value })
                  }
                />
                <label htmlFor="publisher">Editeur:</label>
                <input
                  type="text"
                  id="publisher"
                  placeholder="Editeur"
                  value={formData.editor}
                  onChange={(e) =>
                    setFormData({ ...formData, editor: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="pubLink">Lien editeur:</label>
                <input
                  type="text"
                  id="pubLink"
                  placeholder="Lien editeur"
                  value={formData.editorlink}
                  onChange={(e) =>
                    setFormData({ ...formData, editorlink: e.target.value })
                  }
                />
                <label htmlFor="edition">Edition:</label>
                <input
                  type="text"
                  id="edition"
                  placeholder="Edition"
                  value={formData.edition}
                  onChange={(e) =>
                    setFormData({ ...formData, edition: e.target.value })
                  }
                />
                <label htmlFor="isbn">ISBN/Issn:</label>
                <input
                  type="text"
                  id="isbn"
                  placeholder="ISBN/Issn"
                  value={formData.isbn}
                  onChange={(e) =>
                    setFormData({ ...formData, isbn: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="pubDate">Date de publication:</label>
                <input
                  type="date"
                  id="pubDate"
                  placeholder="Date publication"
                  value={formData.pubdata}
                  onChange={(e) =>
                    setFormData({ ...formData, pubdata: e.target.value })
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
            <div className="SendM">Modifier Conférences:</div>
            <form className="user-form" onSubmit={handleUpdateConf}>
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
                <label htmlFor="title">Titre de Publication:</label>
                <input
                  type="text"
                  id="title"
                  placeholder="Titre de Publication"
                  value={formData.publicationtitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publicationtitle: e.target.value,
                    })
                  }
                />
                <label htmlFor="authors">Auteur(s):</label>
                <input
                  type="text"
                  id="authors"
                  placeholder="Auteurs"
                  value={formData.authors}
                  onChange={(e) =>
                    setFormData({ ...formData, authors: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="confTitle">Titre de la conférence:</label>
                <input
                  type="text"
                  id="confTitle"
                  placeholder="Titre de la conférence"
                  value={formData.conferencetitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      conferencetitle: e.target.value,
                    })
                  }
                />
                <label htmlFor="confSite">Site de la conférence:</label>
                <input
                  type="text"
                  id="confSite"
                  placeholder="Site de la conférence"
                  value={formData.conferencesite}
                  onChange={(e) =>
                    setFormData({ ...formData, conferencesite: e.target.value })
                  }
                />
                <label htmlFor="publisher">Editeur:</label>
                <input
                  type="text"
                  id="publisher"
                  placeholder="Editeur"
                  value={formData.editor}
                  onChange={(e) =>
                    setFormData({ ...formData, editor: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="pubLink">Lien editeur:</label>
                <input
                  type="text"
                  id="pubLink"
                  placeholder="Lien editeur"
                  value={formData.editorlink}
                  onChange={(e) =>
                    setFormData({ ...formData, editorlink: e.target.value })
                  }
                />
                <label htmlFor="edition">Edition:</label>
                <input
                  type="text"
                  id="edition"
                  placeholder="Edition"
                  value={formData.edition}
                  onChange={(e) =>
                    setFormData({ ...formData, edition: e.target.value })
                  }
                />
                <label htmlFor="isbn">ISBN/Issn:</label>
                <input
                  type="text"
                  id="isbn"
                  placeholder="ISBN/Issn"
                  value={formData.isbn}
                  onChange={(e) =>
                    setFormData({ ...formData, isbn: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="pubDate">Date publication:</label>
                <input
                  type="date"
                  id="pubDate"
                  placeholder="Date publication"
                  value={formData.pubdata}
                  onChange={(e) =>
                    setFormData({ ...formData, pubdata: e.target.value })
                  }
                />
              </div>
              <button className="save-button">Modifier</button>
            </form>
          </div>
        </div>
      )}
      {showDeletePopup && (
        <div className="popup">
          <div className="popup-inner">
            <div className="SendM">
              Êtes-vous sûr de vouloir supprimer cette Conference ?
            </div>
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

export default Conference;
