import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { register } from "next/dist/next-devtools/userspace/pages/pages-dev-overlay-setup";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);

  const router = useRouter();

  const dispath = useDispatch();

  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [ userLoginMethod, setUserLoginMethod ] = useState(false);

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if(localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, []);

  useEffect(() => {
    dispath(emptyMessage());    
  }, [userLoginMethod]);

  const handleRegister = () => {
    console.log("Registering...");
    dispath(registerUser({ username, password, email, name }));
  };

  const handleLogin = () => {
    console.log("Loggin...");
    dispath(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <p className={styles.cardleft__heading}>
              {" "}
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message.message}
            </p>
            <div className={styles.inputContainers}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    type="tyext"
                    placeholder="Username"
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    type="tyext"
                    placeholder="Name"
                  />
                </div>
              )}

              <input
                onChange={(e) => setEmailAddress(e.target.value)}
                className={styles.inputField}
                type="tyext"
                placeholder="Email"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                type="tyext"
                placeholder="Password"
              />
              <div
                onClick={() => {
                  if (userLoginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className={styles.buttonWithOutline}
              >
                <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>

          <div className={styles.cardContainer__right}>
            <div>
              { userLoginMethod ? <p>Don't have an account</p> : <p>Already have an account</p> }
              <div
              style={{ backgroundColor: "pink", border: "2px solid black"}}
                onClick={() => {
                  setUserLoginMethod(!userLoginMethod);
                }}
                className={styles.buttonWithOutline}
              >
                <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
