import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Changed import
import Profile from "./Pages/Login/Profile/Profile";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Login/Register/Register";
import Publication from "./Pages/Login/Publication/Publication";
import Demand from "./Pages/Login/Demand/Demand";
import Meeting from "./Pages/Login/Meeting/Meeting";
import Manage from "./Pages/Login/ManageMe/Manage";
import RS from "./Pages/Login/rs/RS";
import Conference from "./Pages/Login/Conference/Conference";
import Chapitre from "./Pages/Login/Chapitredou/Chapitre";
import PublicationCard from "./Pages/Login/publicationtest/PublicationCard";
import Home from "./Pages/Login/home/Home";
import AdminRoute from "./Pages/Login/AdminRoute";





const App = () => {
  return (
    <Router>
      <div className="app">
        <div className="content">
          <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/publication" element={<Publication />} />
            <Route path="/demand" element={<Demand />} />
            <Route path="/meeting" element={<Meeting />} />
            <Route path="/manage" element={<AdminRoute Component={Manage} />} />
           
            <Route path="/publi" element={<PublicationCard />} />
            <Route path="/rs" element={<RS />} />
            <Route path="/chapitre" element={<Chapitre />} />
            <Route path="/conference" element={<Conference />} />
            

            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
