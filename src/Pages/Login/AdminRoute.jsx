import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const AdminRoute = ({  Component, ...rest }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.post('http://localhost:3001/sidebar', { token: localStorage.getItem('token') })
      .then(result => {
        setIsAdmin(result.data.data.role === 'admin');
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? <Component {...rest} /> : <Navigate to="/profile" />;
};

export default AdminRoute;
