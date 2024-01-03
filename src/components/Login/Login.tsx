import React from "react";
import { Button } from "@carbon/react";
import { Password } from "@carbon/react/icons";
import Logo from "../../assets/Logo/Logo";
import styles from "./login.module.scss";
import UserService from "../../service/UserService";

const Login: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div style={{ position: "absolute", top: 40, left: 40, width: 90 }}>
        <Logo />
      </div>

      <div className={styles.tile}>
        <h1>Quantum Safe Advisor</h1>
        <p>Please login to access the IBM Quantum Safe Advisor dashboard.</p>
        <Button
          style={{ marginTop: 40, width: "100%" }}
          onClick={() => UserService.doLogin()}
          renderIcon={Password}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
