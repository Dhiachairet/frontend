import React, { useState, useEffect } from "react";
import Sidebar from "../../../component/Sidebar";
import "./Demand.css"; // Import the CSS file for Demand
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 
import PublicationDem from "../publicationtest/publicationDem";

const Demand = () => {
  const [demand, setDemand] = useState([]);
  const [formData , setFormData] = useState({
    name:"",
    equipement:"",
    debut:"",
    fin:"",


  });
  const [isAdmin, setIsAdmin] = useState(false);
  

  useEffect(() =>{
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Get JWT token from localStorage
      const decodedToken = jwtDecode(token); // Decode the token
      const userId = decodedToken.userId;
      
      try{
        if (decodedToken.role === "admin") {
          setIsAdmin(true);
          const response = await axios.get("http://localhost:3001/getAlldemand" ,{
            headers: {
              Authorization: token,
              userId: userId, // Send the user ID in the request headers
            },
          });
          setDemand(response.data);
      }
      else {
        const response = await axios.get("http://localhost:3001/getdemand", {
          headers: {
            Authorization: token,
            userId: userId,
          },
        });
        setDemand(response.data);

      }
    } catch (error) {
      console.log("error fetching demands" , error);
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


const handleUpdateDem = (e) => {
  e.preventDefault();
  const {
    _id,
    name,
    equipement,
    debut,
    fin,
  } = formData;
  axios
  .put(`http://localhost:3001/updatedemn/${_id}`, {
    name,
    equipement,
    debut,
    fin,

  })
  .then((result) => {
    console.log("demand updated successfully: ",result.data);

    setDemand(demand.map((item) => (item._id === _id ? result.data : item )));
    toggleUpdatePopup();
    })
    .catch ((err) => console.error("error updating demand:" , err));

};

  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = (e) => {
    e.preventDefault();
    setShowPopup(!showPopup);
  };
  
  const handleAdddem = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get the JWT token from localStorage
    const decodedToken = jwtDecode(token); // Decode the token
    const userID = decodedToken.userID; // Get the user's ID from the decoded token
    
    try{const response = await axios.post(
      "http://localhost:3001/adddemand",
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
    console.log("demand added successfully:", response.data);
    setShowPopup(false); // Close the popup after adding
    setDemand([...demand, response.data]);
 } catch (error) {
  console.error("Error adding demand:", error);
 }
  };
  
  const [deleteId, setDeleteId] = useState(null);
  //delete demand
  const handleDeleteDem = (id) => {
    setShowDeletePopup(true);
    setDeleteId(id);
  };
  const handleDeleteConfirmed = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:3001/deletedem/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      console.log("demand deleted successfully:", response.data);
      setDemand(demand.filter((item) => item._id !== id ));
      setShowDeletePopup(false);
 } catch (error) {
  console.error("error deleting rsfile:", error);
 }
};








  return (
    <div className="Demand-containerD">
      <Sidebar/>
      <div className="Demand-contentD">
        <h1>Demande </h1>
        <div className="divaddR">
          <button onClick={togglePopup} className="AddUR">
            Ajouter+
          </button>
        </div>
        <div className="publication-list">
          { demand.map((entry) => (
            <div className="publication-card" key={entry._id}>
              <div className="edit-delete-container">
                <FontAwesomeIcon 
                icon={faPen}
                className="edit-icon"
                onClick={ () => {
                  setFormData({
                    _id: entry._id,
                    name:entry.name,
                    equipement:entry.equipement,
                    debut:entry.debut,
                    fin:entry.fin,

                  });
                  toggleUpdatePopup();

                }} />
                <FontAwesomeIcon 
                icon={faTrash}
                className="delete-icon"
                onClick={ () => handleDeleteDem(entry._id)}
                />
                </div>
                <PublicationDem 
                name={entry.name}
                equipement={entry.equipement}
                debut={entry.debut}
                fin={entry.fin}
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
            <div className="SendM">Demand :</div>
            <form className="user-form" onSubmit={handleAdddem}>
              <div className="input-group">
                <label htmlFor="nometprenom">Nom et Prénom:</label>
                <input type="text" placeholder="Nom et Prenom"
                value={formData.name}
                onChange={(e) => 
                  setFormData({ ...formData, name: e.target.value})
                } />
                <div className="equipement-demandee">
                  <label htmlFor="EquipementDemande">
                    Equipement Demandéé:
                  </label>
                  <br />
                  <textarea
                    id="EquipementDemande"
                    name="EquipementDemande"
                    placeholder="Entrer les détails de l'équipement..."
                    rows={8}
                    cols={50}
                    value={formData.equipement}
                    onChange={(e) => 
                      setFormData({ ...formData, equipement: e.target.value})
                    }
                  ></textarea>
                </div>
                <div className="periode-utilisation">
                  <label htmlFor="periodeUtilisation">
                    Période d’Utilisation:
                  </label>
                  <div className="date-inputs">
                    <span>Début :</span>
                    <input
                      type="date"
                      id="periodeUtilisation"
                      name="periodeUtilisation"
                      value={formData.debut}
                      onChange={(e) => 
                        setFormData({
                          ...formData,
                          debut: e.target.value
                        })
                      }
                     
                    />
                    <span>Fin :</span>
                    <input
                      type="date"
                      id="periodeUtilisationEnd"
                      name="periodeUtilisationEnd"
                      value={formData.fin}
                      onChange={(e) => 
                        setFormData({
                          ...formData,
                          fin: e.target.value
                        })
                      }
                      
                    />
                  </div>
                </div>
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
            <div className="sendM">Modifier Demand:</div>
            <form className="user-form" onSubmit={handleUpdateDem}>
              <div className="input-group">
                <input type="hidden"
                id="_id"
                value={formData._id}
                onChange={(e)=> 
                  setFormData({ ...formData, _id: e.target.value})
                } />
              </div>
              <div className="input-group">
                <label htmlFor="nometprenom">Nom et Prénom:</label>
                <input type="text" 
                id="name"
                placeholder="Nom et Prenom"
                value={formData.name}
                onChange={(e) => 
                  setFormData({ ...formData, name: e.target.value})
                } />
                  <div className="equipement-demandee">
                    <label htmlFor="EquipementDemande"> Equipment Demande:</label>
                <br />
                <textarea
                    id="EquipementDemande"
                    name="EquipementDemande"
                    placeholder="Enter equipment details..."
                    rows={8}
                    cols={50}
                    value={formData.equipement}
                    onChange={(e) => 
                      setFormData({ ...formData, equipement: e.target.value})
                    }
                    
                  ></textarea></div>
                  <div className="periode-utilisation">
                  <label htmlFor="periodeUtilisation">
                    Période d’Utilisation:
                  </label>
                  <div className="date-inputs">
                    <span>Début :</span>
                    <input
                      type="date"
                      id="periodeUtilisation"
                      name="periodeUtilisation"
                      value={formData.debut}
                      onChange={(e) => 
                        setFormData({
                          ...formData,
                          debut: e.target.value
                        })
                      }
                     
                    />
                    <span>Fin :</span>
                    <input
                      type="date"
                      id="periodeUtilisationEnd"
                      name="periodeUtilisationEnd"
                      value={formData.fin}
                      onChange={(e) => 
                        setFormData({
                          ...formData,
                          fin: e.target.value
                        })
                      }
                     
                    />
                  </div>
                    
                  </div>
                

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
            <div className="SendM">Êtes-vous sûr de vouloir supprimer cette Demande ?</div>
            <br />
            <div className="button-group">
              <button className="cancel-button" onClick={() => setShowDeletePopup(false)}>Annuler</button>
              <button className="delete-button"onClick={() => handleDeleteConfirmed(deleteId)} >Supprimer</button>
            </div>

          </div>
          </div>

      )}
    </div>
  );
};

export default Demand;
