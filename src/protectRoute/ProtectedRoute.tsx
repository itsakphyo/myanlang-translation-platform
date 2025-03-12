import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedUserTypes: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedUserTypes, children }) => {
  const userType = localStorage.getItem("userType");

  if (!userType || !allowedUserTypes.includes(userType)) {
    return <Navigate to="/page-not-found" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
