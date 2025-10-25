import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const isAuthed = !!localStorage.getItem('access');
  return isAuthed ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;