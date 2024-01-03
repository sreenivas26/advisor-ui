import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../service/UserService";

interface PrivateRoutesProps {
  Component: React.ComponentType;
}

const PrivateRoutes: React.FC<PrivateRoutesProps> = ({ Component }) => {
  const navigate = useNavigate();
  const auth = UserService.isLoggedIn();

  useEffect(() => {
    if (auth === false) {
      navigate("/login");
    }
  }, [auth, navigate]);

  return <Component />;
};

export default PrivateRoutes;
