import { createContext, useState } from "react";
import axios from "axios";

//create context obj
export const loginContext = createContext();

function LoginProvider({ children }) {
  let [currentUserDetails, setCurrentUserDetails] = useState({
    userLoginStatus: false,
    currentUser: {},
    err: "",
  });

  async function loginUser(credObj) {
      let res = await axios.post("http://localhost:4000/usersapi/login",credObj);

      if (res.data.message === "Login Successfull") {
         sessionStorage.setItem('token',res.data.token)

        setCurrentUserDetails({
          ...currentUserDetails,
          currentUser: res.data.user,
          userLoginStatus: true,
        });
      } else {
        setCurrentUserDetails({
          ...currentUserDetails,
          err: res.data.message,
          userLoginStatus: false,
          currentUser: {},
        });
      }
  }

  return (
    <loginContext.Provider value={{ currentUserDetails, setCurrentUserDetails, loginUser }}>
      {children}
    </loginContext.Provider>
  );
}

export default LoginProvider;