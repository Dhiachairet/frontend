import React, { useEffect, useState } from "react";
import "./profile.css"; // Import the CSS file
import Sidebar from "../../../component/Sidebar";
import axios from "axios";
import {

  Document,
  Page,
  Text,
  View,
  
  pdf
} from "@react-pdf/renderer";
import { saveAs } from 'file-saver';



const styles = {
  page: {
    fontFamily: "Times-Roman",
    fontSize: 11,
    padding: 40,
  },
  arabicText: {
    fontFamily: "Arial",
  },
  bordered: {
    border: 1,
    borderColor: "black",
    borderStyle: "solid",
    padding: 5,
    marginBottom: 5,
  },

  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomwidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },

  column: {
    width: "50%",
    borderRightWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 4,
  },
  section: {
    marginBottom: 10,
  },
  centeredText: {
    textAlign: "center",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    marginBottom: 5,
  },

  gradeAndDateContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  contactInfoContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  diplomeAndDateContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  signature: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  signatureContainer: {
    marginTop: 20,
  },
};
const ProfilePdf = ({ userData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.bordered}>
          <View style={styles.section}>
            <Text style={styles.centeredText}>FICHE INDIVIDUELLE</Text>
          </View>

          <Text>
            (<Text style={{ fontWeight: "bold" }}>Obligatoire</Text> pour tout
            enseignant-chercheur, doctorant et cadre technique ayant un grade
            équivalent ou homologue au grade d’assistant d’enseignement
            supérieur. Elle doit être dûment remplie sous peine de ne pas être
            prise en considération)
          </Text>
        </View>

        <View style={styles.bordered}>
          <Text>
            -Tout enseignant-chercheur faisant partie d'un LR ou UR, ne peut
            faire partie d’une autre structure de recherche.{" "}
          </Text>
          <Text>
            -Tout doctorant doitfournir obligatoirement une attestation
            d’inscription au titre de l’année universitaire en cours. Ils seront
            comptabilisés, entant que membre du laboratoire, uniquement les
            doctorants ayant cumulés un maximum de 5 inscriptions à la date de
            soumission de la demande du laboratoire.
          </Text>
        </View>
      </View>

      <View style={styles.bordered}>
        <View>
          <View style={[styles.tableRow]}>
            <Text>
              <Text style={styles.centeredText}>
                1- IDENTIFICATION DU CHERCHEUR
              </Text>
            </Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Nom et Prénom: {userData.name}</Text>
            </View>
            <View style={styles.tableCell}>
             
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Date et lieu de naissance: {userData.birthDate}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>
                <Text>
                  Sexe: {userData.gender === "female" ? "Féminin" : "Masculin"}
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>N° CIN (tunisien): {userData.cinNumber}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>N° Passeport (étranger): {userData.passportNumber}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Matricule CNRPS: {userData.cnrpsMatricule}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text></Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bordered}>
        <View style={styles.gradeAndDateContainer}>
          <Text>- Grade: {userData.grade}</Text>
          <Text style={{ marginLeft: 45 }}>- Depuis le: {userData.since}</Text>
        </View>
        <View style={styles.contactInfoContainer}>
          <Text>- Téléphone: {userData.phone}</Text>
          <Text style={{ marginLeft: 45 }}>- E-mail: {userData.email}</Text>
        </View>
        <View style={styles.diplomeAndDateContainer}>
          <Text>- Dernier diplôme obtenu: {userData.lastDegree}</Text>
          <Text style={{ marginLeft: 45 }}>- Date: {userData.degreeDate}</Text>
        </View>
        <Text>- establishment: {userData.establishment}</Text>
      </View>

      <View style={styles.bordered}>
        <View style={styles.section}>
          <Text style={styles.centeredText}>
            IDENTIFICATION DE L’UNITE DE RECHERCHE (de rattachement)
          </Text>
        </View>
        <Text>- Code de structure: LR20ES11</Text>
        <Text>
          - Dénomination du L.R : Hatem Bettahar : Informatique, Réseaux,
          Systèmes de Communication et Mathématiques-IReSCoMath
        </Text>
        <Text>
          - Etablissement : Faculté des Sciences de Gabès Université :
          Université de Gabès
        </Text>
        <Text>- Responsable du L.R.: Haifa Touati</Text>
      </View>
      <View style={styles.bordered}>
        <View style={styles.section}>
          <Text style={styles.centeredText}>CASE RESERVEE AU DOCTORANT</Text>
        </View>
        <Text>
          - Intitulé du sujet de recherche : {userData.researchSubject}
        </Text>
        <Text>- Taux d’avancement : {userData.progressRate}%</Text>
        <Text>
          - Année universitaire de la première inscription :
          {userData.firstYearRegistration}
        </Text>
        <Text>
          - Établissement universitaire (où est effectuée l’inscription) :
          {userData.university}
        </Text>
        <Text>
          - Nom et prénom du directeur de thèse :{userData.thesisDirector}
        </Text>
      </View>

      <View style={styles.signatureContainer}>
        <View style={styles.signature}>
          <Text>Signature du chercheur</Text>
          <Text>Date : .... /.... /....</Text>
        </View>
        <View style={styles.signature}>
          <Text>Signature du chef du L.R.</Text>
          <Text>Date : .... /.... /....</Text>
        </View>
        <View style={styles.signature}>
          <Text>Signature du chef de l’établissement</Text>
          <Text>Date : .... /.... /....</Text>
        </View>
        <View style={styles.signature}>
          <Text>Signature du Président de l’Université</Text>
          <Text>Date : .... /... ./....</Text>
        </View>
      </View>
      {/* <View style={styles.section}> */}
      <View style={[styles.section, { marginTop: 20 }]}>
        <Text>
          NB : Les quatre signatures originales (non scannées) sont obligatoires
          sous peine de ne pas être prises en considération.
        </Text>
      </View>
    </Page>
  </Document>
);
const Profile = () => {
  const [userData, setUserData] = useState({
    // Initialize all fields with default values if needed
    name: "",
    email: "",
    phone: "",
    password: "",
    dblplink: "",
    // Add all other fields here with default values
    namear: "",
    birthDate: "",
    gender: "",
    cinNumber: "",
    passportNumber: "",
    cnrpsMatricule: "",
    establishment: "",
    grade: "",
    since: "",
    lastDegree: "",
    degreeDate: "",
    degreeEstablishment: "",
    researchSubject: "",
    progressRate: "",
    firstYearRegistration: "",
    university: "",
    thesisDirector: "",
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios
      .post("http://localhost:3001/profile", {
        token: localStorage.getItem("token"),
      })
      .then((result) => {
        setUserData(result.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };
  const handleCancel = () => {
    setEditMode(false);
    // Reset user data if needed
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Format birthDate before sending it
    const formattedUserData = {
      ...userData,
      birthDate: new Date(userData.birthDate).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    };

    axios
      .put("http://localhost:3001/updateProfile", {
        token: localStorage.getItem("token"),
        userData: formattedUserData, // Send all fields including formatted birthDate
      })
      .then((result) => {
        setEditMode(false);
        console.log("user updated", result.data.updatedData);
        setUserData(result.data.updatedData);
      })
      .catch((err) => console.log(err));
  };
  const handleDownloadPdf = async () => {
    const blob = await pdf(<ProfilePdf userData={userData} />).toBlob();
    saveAs(blob, 'fiche_individuelle.pdf');
  };

  return (
    <>
      <div className="form-container">
        <Sidebar />
        <h2 className="form-title">Profil</h2>
        <div className="button-container">
          {editMode ? (
            <button className="edit-button" onClick={handleCancel}>
              Annuler
            </button>
          ) : (
            <>
              <button className="edit-button" onClick={handleEdit}>
                Editer
              </button>
              <button className="pdf-button" onClick={handleDownloadPdf}>
              Télécharger PDF
              </button>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label className="form-label">Nom et Prénom :</label>
              <input
                className="form-input"
                placeholder="Nom et Prenom"
                value={userData.name}
                disabled={!editMode}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">E-mail :</label>
              <input
                className="form-input"
                value={userData.email}
                type="email"
                disabled={!editMode}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">Téléphone :</label>
              <input
                className="form-input"
                value={userData.phone}
                type="tel"
                disabled={!editMode}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">Mot de pass :</label>
              <input
                className="form-input"
                value={userData.password}
                type="password"
                disabled={!editMode}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">DBLP Lien(xml):</label>
              <input
                value={userData.dblplink}
                className="form-input"
                placeholder="Enter your DBLP XML link"
                disabled={!editMode}
                onChange={(e) =>
                  setUserData({ ...userData, dblplink: e.target.value })
                }
              />
            </div>
            <br />

            <div>
              <h4>FICHE INDIVIDUELLE</h4>
            </div>
            <br />
            <div>
              <label className="form-label">Date de Naissance :</label>
              <input
                type="date"
                className="form-input"
                value={userData.birthDate}
                placeholder="Date et lieu de naissance"
                disabled={!editMode}
                onChange={(e) =>
                  setUserData({ ...userData, birthDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">الاسم و اللقب :</label>
              <input
                className="form-input"
                placeholder="اسمك و لقبك"
                value={userData.namear}
                disabled={!editMode}
                onChange={(e) =>
                  setUserData({ ...userData, namear: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">N° CIN (tunisien) :</label>
              <input
                className="form-input"
                placeholder="Numéro de CIN"
                value={userData.cinNumber}
                disabled={!editMode}
                onChange={(e) =>
                  setUserData({ ...userData, cinNumber: e.target.value })
                }
              />
            </div>
            <div className="flex items-center">
              <label className="form-label">Sexe :</label>
              <div className="form-radio">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female" // Specify the value for female
                  checked={userData.gender === "female"}
                  disabled={!editMode}
                  onChange={(e) =>
                    setUserData({ ...userData, gender: e.target.value })
                  }
                />
                <label className="ml-2" htmlFor="female">
                  Féminin
                </label>
              </div>
              <div className="form-radio">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male" // Specify the value for male
                  checked={userData.gender === "male"}
                  disabled={!editMode}
                  onChange={(e) =>
                    setUserData({ ...userData, gender: e.target.value })
                  }
                />
                <label className="ml-2" htmlFor="male">
                  Masculin
                </label>
              </div>
            </div>

            <div>
              <label className="form-label">N° Passeport (étranger) :</label>
              <input
                className="form-input"
                placeholder="Numéro de passeport"
                value={userData.passportNumber}
                disabled={!editMode}
                onChange={(e) =>
                  setUserData({ ...userData, passportNumber: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">Matricule CNRPS :</label>
              <input
                className="form-input"
                placeholder="Matricule CNRPS"
                value={userData.cnrpsMatricule}
                disabled={!editMode}
                onChange={(e) =>
                  setUserData({ ...userData, cnrpsMatricule: e.target.value })
                }
              />
            </div>

            <div className="col-span-2">
              <label className="form-label">
                Etablissement d’affectation :
              </label>
              <input
                value={userData.establishment}
                className="form-input"
                placeholder="Etablissement d'affectation"
                disabled={!editMode}
                onChange={(e) =>
                  setUserData({ ...userData, establishment: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">Grade :</label>
              <input
                className="form-input"
                placeholder="Grade"
                value={userData.grade}
                disabled={!editMode}
                onChange={(e) =>
                  setUserData({ ...userData, grade: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">depuis le :</label>
              <input
                type="date"
                className="form-input"
                placeholder="Date de début"
                value={userData.since}
                disabled={!editMode}
                onChange={(e) =>
                  setUserData({ ...userData, since: e.target.value })
                }
              />
            </div>

            <div className="col-span-2">
              <label className="form-label">Dernier diplôme obtenu :</label>
              <input
                type="text"
                value={userData.lastDegree}
                className="form-input"
                placeholder="Dernier diplôme obtenu"
                disabled={!editMode}
                onChange={(e) =>
                  setUserData({ ...userData, lastDegree: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">Date :</label>
              <input
                type="date"
                className="form-input"
                placeholder="Date d'obtention"
                value={userData.degreeDate}
                disabled={!editMode}
                onChange={(e) =>
                  setUserData({ ...userData, degreeDate: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <label className="form-label">Etablissement :</label>
              <input
                value={userData.degreeEstablishment}
                className="form-input"
                placeholder="Etablissement de formation"
                disabled={!editMode}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    degreeEstablishment: e.target.value,
                  })
                }
              />
            </div>

            {userData.role === "Doctorant" && (
              <>
                <div>
                  <label className="form-label">
                    Intitulé du sujet de recherche:
                  </label>
                  <input
                    value={userData.researchSubject}
                    className="form-input"
                    disabled={!editMode}
                    placeholder="Research subject title"
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        researchSubject: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="form-label">Taux d’avancement:</label>
                  <input
                    value={userData.progressRate}
                    className="form-input"
                    disabled={!editMode}
                    placeholder="Rates of progress"
                    onChange={(e) =>
                      setUserData({ ...userData, progressRate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="form-label">
                    Année universitaire de la première inscription :
                  </label>
                  <input
                    type="date"
                    value={userData.firstYearRegistration}
                    className="form-input"
                    disabled={!editMode}
                    placeholder="Academic year of first registration"
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        firstYearRegistration: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="form-label">
                    Etablissement universitaire:
                  </label>
                  <input
                    value={userData.university}
                    disabled={!editMode}
                    className="form-input"
                    placeholder="University"
                    onChange={(e) =>
                      setUserData({ ...userData, university: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="form-label">
                    Nom et prénom du directeur de thèse:
                  </label>
                  <input
                    value={userData.thesisDirector}
                    className="form-input"
                    disabled={!editMode}
                    placeholder="First and last name of the thesis director:"
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        thesisDirector: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            )}
          </div>
          {editMode && (
          
            <button type="submit" className="valider-button">
              Valider
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default Profile;
