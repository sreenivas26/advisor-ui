import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import DashboardComponent from "./components/Dashboard/Dashboard";

import CiphersuitDetails from "./components/Dashboard/Tables/CiphersuitDetails";
import HostDetails from "./components/Dashboard/Tables/HostDetails";
import ComplianceDetails from "./components/Dashboard/Tables/ComplianceDetails";
import PrivateRoute from "./helper/PrivateRoutes";
import UserService from "./service/UserService";

const AppRouter: React.FC = () => {
  const auth = UserService.isLoggedIn();

  if (auth === true && window.location.pathname === "/login") {
    window.location.href = window.location.href.replace("/login", "");
    // Ensure there's always a return value, in this case, returning null
    return null;
  }

  return (
    <Routes>
      <Route path="/login" element={<PrivateRoute Component={Login} />} />
      <Route
        path="/"
        element={<PrivateRoute Component={DashboardComponent} />}
      />
      <Route
        path="/:selectedContent"
        element={<PrivateRoute Component={DashboardComponent} />}
      />
      <Route
        path="/:selectedContent/host-details/:id"
        element={<PrivateRoute Component={HostDetails} />}
      />
      <Route
        path="/:selectedContent/ciphersuite-details/:id"
        element={<PrivateRoute Component={CiphersuitDetails} />}
      />
      <Route
        path="/inventory/details/ciphersuite/:id?"
        element={<PrivateRoute Component={CiphersuitDetails} />}
      />
      <Route
        path="/:selectedContent/compliance-details/:id"
        element={<PrivateRoute Component={ComplianceDetails} />}
      />
      {/* Add a default route */}
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
