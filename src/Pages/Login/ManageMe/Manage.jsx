import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../component/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./Manage.css";
import { CSVLink } from 'react-csv';


const Manage = () => {
  const [users, setUsers] = useState([]);
  const [userPublications, setUserPublications] = useState([]);

  const prepareCSVData = () => {
    const headers = [
      { label: 'Email', key: 'email' },
      { label: 'Name', key: 'name' },
      { label: 'Journal Title', key: 'rsTitle' },
      { label: 'Journal Authors', key: 'rsAuthors' },
      { label: 'Conference Title', key: 'confTitle' },
      { label: 'Conference Authors', key: 'confAuthors' },
      { label: 'Chapitre Title', key: 'chapitreTitle' },
      { label: 'Chapitre Authors', key: 'chapitreAuthors' },
    ];

    const csvData = userPublications.map((entry) => ({
      email: entry.user.email,
      name: entry.user.name,
      rsTitle: entry.rsPublications.map((pub) => pub.title).join('\n'),
      rsAuthors: entry.rsPublications.map((pub) => pub.authors).join('\n'),
      confTitle: entry.conferencePublications.map((pub) => pub.title).join('\n'),
      confAuthors: entry.conferencePublications.map((pub) => pub.authors).join('\n'),
      chapitreTitle: entry.chapitrePublications.map((pub) => pub.title).join('\n'),
      chapitreAuthors: entry.chapitrePublications.map((pub) => pub.authors).join('\n'),
    }));

    return { headers, data: csvData };
  };

  const [pendingUsers, setPendingUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    axios
      .get("http://localhost:3001/getUsers")
      .then((result) => setUsers(result.data))
      .catch((err) => console.log(err));

      axios
      .get("http://localhost:3001/getUsersWithPublications")
      .then((result) => setUserPublications(result.data))
      .catch((err) => console.log(err));

      axios
      .get("http://localhost:3001/pending-users")
      .then((result) => setPendingUsers(result.data))
      .catch((err) => console.log(err));
  }, []);

  const toggleAddPopup = () => {
    setShowAddPopup(!showAddPopup);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/registerAdmin", formData)
      .then((result) => {
        console.log("User added successfully:", result.data);
        axios
          .get("http://localhost:3001/getUsers")
          .then((result) => setUsers(result.data))
          .catch((err) => console.log(err));
        toggleAddPopup(); // Close the add popup after adding user
      })
      .catch((err) => console.error("Error adding user:", err));
  };

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  const toggleUpdatePopup = () => {
    setShowUpdatePopup(!showUpdatePopup);
  };
//update
  const handleUpdateUser = (e) => {
    e.preventDefault();
    const { _id, name, email, phone, password, role } = formData; // Include role in formData
    axios
      .put(`http://localhost:3001/updateUser/${_id}`, {
        name,
        email,
        phone,
        password,
        role, // Pass role in the request
      })
      .then((result) => {
        console.log("User updated successfully:", result.data);
        axios
          .get("http://localhost:3001/getUsers")
          .then((result) => setUsers(result.data))
          .catch((err) => console.log(err));
        toggleUpdatePopup();
      })
      .catch((err) => console.error("Error updating user:", err));
  };

  //delete
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const toggleDeletePopup = () => {
    setShowDeletePopup(!showDeletePopup);
  };
  const handleDeleteUser = (userId) => {
    setDeleteId(userId);
    setShowDeletePopup(true);
  };
  const handleDeleteConfirmed = (userId) => {
    axios
      .delete(`http://localhost:3001/deleteUser/${userId}`)
      .then((result) => {
        console.log("User deleted successfully:", result.data);
        axios
          .get("http://localhost:3001/getUsers")
          .then((result) => setUsers(result.data))
          .catch((err) => console.log(err));
        setShowDeletePopup(false);
      })
      .catch((err) => console.error("Error deleting user:", err));
  };
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleApproveUser = async (userId) => {
    try {
      // Approve the user
      const approveResult = await axios.post(`http://localhost:3001/approve-user/${userId}`);
      console.log("User approved successfully:", approveResult.data);
  
      // Update the users state with the new data
      const usersResult = await axios.get("http://localhost:3001/getUsers");
      setUsers(usersResult.data);
  
      // Remove the pending user
      const denyResult = await axios.post(`http://localhost:3001/deny-user/${userId}`);
      console.log("Pending user removed successfully:", denyResult.data);
  
      // Update the pendingUsers state with the new data
      const pendingUsersResult = await axios.get("http://localhost:3001/pending-users");
      setPendingUsers(pendingUsersResult.data);
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };
  
  
  const handleDenyUser = (userId) => {
    axios
      .post(`http://localhost:3001/deny-user/${userId}`)
      .then((result) => {
        console.log("User denied successfully:", result.data);
        axios
          .get("http://localhost:3001/pending-users")
          .then((result) => {
            setPendingUsers(result.data); // Update the pendingUsers state with the new data
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.error("Error denying user:", err));
  };
  


  return (
    <>
      <div className="Manage-containerM">
        <Sidebar />
        <div className="Manage-contentM">
          <h1>Gérer les utilisateurs</h1>
          <div className="divadd">
          <CSVLink {...prepareCSVData()} filename="users.csv">
             <button className="AddE">Exporter les utilisateurs</button> 
            </CSVLink>
            <button onClick={toggleAddPopup} className="AddU">
            Ajouter+
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
              <th>Email</th>
                <th>Nom</th>
                <th>Téléphone</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                  
                  <td>{user.role}</td>
                  <td className="edit-delete-container">
                    <button
                      onClick={() => {
                        setFormData({
                          _id: user._id,
                          name: user.name,
                          email: user.email,
                          phone: user.phone,
                          password: user.password,
                          role: user.role,
                        });
                        toggleUpdatePopup();
                      }}
                      className="edit-buttonM"
                    >
                       Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="delete-buttonM"
                    >
                       Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
            Précédent
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastUser >= users.length}
            >
            Suivant
            </button>
          </div>
          <h3>Utilisateurs en attente</h3>
          <table className="table">
          <thead>
              <tr>
              <th>Email</th>
                <th>Nom</th>
                <th>Téléphone</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {pendingUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                 
                  <td>{user.role}</td>
                  <td className="edit-delete-container">
                    <button
                      onClick={() => handleApproveUser(user._id)}
                      className="approve-button"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => handleDenyUser(user._id)}
                      className="deny-button"
                    >
                      Refuser
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
          <br />
        </div>
        {showAddPopup && (
          <div className="popup">
            <div className="popup-inner">
              <div className="icon">
                <FontAwesomeIcon icon={faXmark} onClick={toggleAddPopup} />
              </div>
              <div className="SendM">Ajouter un utilisateur:</div>
              <form className="user-form" onSubmit={handleAddUser}>
                <div className="input-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="name">Nom :</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="phone">Téléphone :</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="password">Mot de passe:</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="role">Rôle :</label>
                  <select
                  className="form-inputR"
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                     <option value="">Sélectionner un rôle</option>
                    <option value="Student">Professeur</option>
                    <option value="Master">Master</option>
                    <option value="doctrine">Doctorant</option>
                  </select>
                </div>

                <button type="submit" className="save-button">
                Ajouter
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
              <div className="SendM">Modifier l'utilisateur:</div>
              <form className="user-form" onSubmit={handleUpdateUser}>
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
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="name">Nom :</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="phone">Téléphone :</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="password">Mot de passe:</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="role">Rôle :</label>
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

                <button type="submit" className="save-button">
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
            <div>
            Êtes-vous sûr de vouloir supprimer cet utilisateur ?
            </div>
            <br />
            <div className="button-group" >
          
            <button className="cancel-button"
              onClick={() => setShowDeletePopup(false)}
            >
              Annuler
            </button>
            <button
              onClick={() => handleDeleteConfirmed(deleteId)}
              className="delete-button"
            >
              Oui, supprimer
            </button>
            </div>
           
          </div>
        </div>
      )}
        
      </div>
    </>
  );
};

export default Manage;
