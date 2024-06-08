// Publication.jsx
import React, { useState } from 'react';



import Sidebar from '../../../component/Sidebar';
import './publication.css'; // Import the CSS file for Publication

const Publication = () => {
  

  return (
    <div className="publication-containerP">
      <Sidebar />
      <div className="publication-contentP">
        <h2 className="form-titleP">Publication</h2>
        <div className="select-containerP">
          <select  defaultValue="option1">
            
            <option value="option2">Conférences</option>
            <option value="option3">Chapitres d'ouvrages</option>
          </select>
        </div>
     
       
       
       
      </div>
    </div>
  );
};

export default Publication;
