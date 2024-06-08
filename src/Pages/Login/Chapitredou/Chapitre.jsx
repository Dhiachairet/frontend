import Sidebar from "../../../component/Sidebar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark , faPen,faTrash} from "@fortawesome/free-solid-svg-icons";
import "./chapitre.css";
import { jwtDecode } from "jwt-decode";
import PublicationCardchap from "../publicationtest/publicationcardchap";
const Chapitre = () => {
  const [formData, setFormData] = useState({
    chapterNumber: "",
    title: "",
    authors: "",
    publisher: "",
    publisherLink: "",
    edition: "",
    isbn: "",
    publicationDate: "",
  });

  const [chapitres, setChapitres] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      try {
        if (decodedToken.role === "admin") {
          setIsAdmin(true);
          const response = await axios.get(
            "http://localhost:3001/getAllchapitre",
            {
              headers: {
                Authorization: token, // Send JWT token in request headers
                userId: userId, // Send the user ID in the request headers
              },
            }
          );
          setChapitres(response.data);
        } else {
          const response = await axios.get(
            "http://localhost:3001/getchapitre",
            {
              headers: {
                Authorization: token, // Send JWT token in request headers
                userId: userId, // Send the user ID in the request headers
              },
            }
          );
          setChapitres(response.data);
        }
      } catch (error) {
        console.log("Error fetching chapitre douvrages:", error);
      }
    };

    fetchData();
  }, []);

  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  const toggleUpdatePopup = () => {
    setShowUpdatePopup(!showUpdatePopup);
  };

  const handleUpdateChap = (e) => {
    e.preventDefault();
    const {
      _id,
      chapterNumber,
      title,
      authors,
      publisher,
      publisherLink,
      edition,
      isbn,
      publicationDate,
    } = formData;
    axios
      .put(`http://localhost:3001/updatechap/${_id}`, {
        chapterNumber,
        title,
        authors,
        publisher,
        publisherLink,
        edition,
        isbn,
        publicationDate,
      })
      .then((result) => {
        console.log("chapitre updated successfully:", result.data);
       setChapitres(chapitres.map((item) => (item._id === _id ? result.data : item)));
        toggleUpdatePopup();
      })
      .catch((err) => console.error("Error updating chapitre:", err));
  };

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = (e) => {
    e.preventDefault();
    setShowPopup(!showPopup);
  };
  const handleAddChapitre = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get the JWT token from localStorage
    const decodedToken = jwtDecode(token); // Decode the token
    const userID = decodedToken.userID; // Get the user's ID from the decoded token
    console.log(decodedToken);
    try {
      const response = await axios.post(
        "http://localhost:3001/addchapitre",
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
      console.log("cofile added successfully:", response.data);
      setShowPopup(false); // Close the popup after adding
      setChapitres([...chapitres, response.data]); // Add the new chapitre to the list without refreshing
    } catch (error) {
      console.error("Error adding cofile:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const toggleDeletePopup = () => {
    setShowDeletePopup(!showDeletePopup);
  };
  const [deleteId, setDeleteId] = useState(null);

  //delete rs
  const handleDeletechap = (id) => {
    setShowDeletePopup(true); // Show the delete chapirmation popup
    setDeleteId(id); // Set the ID of the entry to be deleted
  };
  const handleDeletechapirmed = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:3001/deletechap/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      console.log("chapitre deleted successfully:", response.data);
      setChapitres(chapitres.filter((item) => item._id !== id));
      setShowDeletePopup(false); // Close the delete popup
    } catch (error) {
      console.error("Error deleting chapitre:", error);
      // Handle the error
    }
  };
  

  return (
    <div className="co-container">
      <Sidebar />
      <div className="co-content">
        <h1>Chapitre d'Ouvrage</h1>
        <div className="divadd">
          <button onClick={togglePopup} className="AddUR">
          Ajouter+
          </button>
        </div>

        <div className="publication-list">
          {chapitres.map((chap) => (
            <div className="publication-card" key={chap._id}>
            <div className="edit-delete-container">
              <FontAwesomeIcon
                icon={faPen}
                className="edit-icon"
                onClick={() => {
                      setFormData({
                        _id: chap._id,
                        chapterNumber: chap.chapterNumber,
                        title: chap.title,
                        authors: chap.authors,
                        publisher: chap.publisher,
                        publisherLink: chap.publisherLink,
                        edition: chap.edition,
                        isbn: chap.isbn,
                        publicationDate: chap.publicationDate,
                      });
                      toggleUpdatePopup();
                    }}
              />
              <FontAwesomeIcon
                icon={faTrash}
                className="delete-icon"
                onClick={() => handleDeletechap(chap._id)}
              />
            </div>
            <PublicationCardchap
              chapterNumber={chap.chapterNumber}
              title={chap.title}
              authors={chap.authors}
              publisher={chap.publisher}
              publisherLink={chap.publisherLink}
              edition={chap.edition}
              isbn={chap.isbn}
              publicationDate={chap.publicationDate}
              
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
            <div className="SendM">Chapitre d'Ouvrage:</div>
            <form className="user-form" onSubmit={handleAddChapitre}>
              <div className="input-group">
                <label htmlFor="chapterNumber">Chapitre d’Ouvrage N°:</label>
                <input
                  type="text"
                  id="chapterNumber"
                  placeholder="Chapitre d’Ouvrage N°"
                  value={formData.chapterNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, chapterNumber: e.target.value })
                  }
                />
                <label htmlFor="title">Titre (*):</label>
                <input
                  type="text"
                  id="title"
                  placeholder="Titre (*)"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
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
              </div>
              <div className="input-group">
                <label htmlFor="publisher">Éditeur(*):</label>
                <input
                  type="text"
                  id="publisher"
                  placeholder="Éditeur(*)"
                  value={formData.publisher}
                  onChange={(e) =>
                    setFormData({ ...formData, publisher: e.target.value })
                  }
                />
                <label htmlFor="publisherLink">Lien éditeur:</label>
                <input
                  type="text"
                  id="publisherLink"
                  placeholder="Lien éditeur"
                  value={formData.publisherLink}
                  onChange={(e) =>
                    setFormData({ ...formData, publisherLink: e.target.value })
                  }
                />
                <label htmlFor="edition">Édition(*):</label>
                <input
                  type="text"
                  id="edition"
                  placeholder="Édition(*)"
                  value={formData.edition}
                  onChange={(e) =>
                    setFormData({ ...formData, edition: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
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
                <label htmlFor="publicationDate">Date de publication:</label>
                <input
                  type="date"
                  id="publicationDate"
                  placeholder="Date publication"
                  value={formData.publicationDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publicationDate: e.target.value,
                    })
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
            <div className="SendM">Modifier Chapitre d'Ouvrage:</div>
            <form className="user-form" onSubmit={handleUpdateChap}>
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
                <label htmlFor="chapterNumber">Chapitre d’Ouvrage N°:</label>
                <input
                  type="text"
                  id="chapterNumber"

                  placeholder="Chapitre d’Ouvrage N°"
                  value={formData.chapterNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, chapterNumber: e.target.value })
                  }
                />
                <label htmlFor="title">Titre (*):</label>
                <input type="text" id="title" placeholder="Titre (*)"
                 value={formData.title}
                 onChange={(e) =>
                   setFormData({ ...formData, title: e.target.value })
                 } />
                <label htmlFor="authors">Auteur(s):</label>
                <input type="text" id="authors" placeholder="Auteur(s)" 
                 value={formData.authors}
                 onChange={(e) =>
                   setFormData({ ...formData, authors: e.target.value })
                 }/>
              </div>
              <div className="input-group">
                <label htmlFor="publisher">Éditeur(*):</label>
                <input type="text" id="publisher" placeholder="Éditeur(*)"
                 value={formData.publisher}
                 onChange={(e) =>
                   setFormData({ ...formData, publisher: e.target.value })
                 } />
                <label htmlFor="publisherLink">Lien éditeur:</label>
                <input
                  type="text"
                  id="publisherLink"
                  placeholder="Lien éditeur"
                  value={formData.publisherLink}
                  onChange={(e) =>
                    setFormData({ ...formData, publisherLink: e.target.value })
                  }
                />
                <label htmlFor="edition">Édition(*):</label>
                <input type="text" id="edition" placeholder="Édition(*)"
                 value={formData.edition}
                 onChange={(e) =>
                   setFormData({ ...formData, edition: e.target.value })
                 } />
              </div>
              <div className="input-group">
                <label htmlFor="isbn">ISBN/Issn:</label>
                <input type="text" id="isbn" placeholder="ISBN/Issn"
                 value={formData.isbn}
                 onChange={(e) =>
                   setFormData({ ...formData, isbn: e.target.value })
                 } />
                <label htmlFor="publicationDate">Date publication:</label>
                <input
                  type="date"
                  id="publicationDate"
                  placeholder="Date publication"
                  value={formData.publicationDate}
                  onChange={(e) =>
                    setFormData({ ...formData, publicationDate: e.target.value })
                  }

                />
              </div>
              <button className="save-button" >
              Modifier
              </button>
            </form>
          </div>
        </div>
      )}
      {showDeletePopup && (
        <div className="popup">
          <div className="popup-inner">
            <div className="SendM">Êtes-vous sûr de vouloir supprimer cette Chapitre d'Ouvrage ?</div>
            <div className="button-group">
              <button className="cancel-button" onClick={() => setShowDeletePopup(false)}>Annuler</button>
              <button className="delete-button" onClick={() => handleDeletechapirmed(deleteId)}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Chapitre;
