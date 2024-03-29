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
    if (credObj.role === "user") {
      let res = await axios.post("http://localhost:4000/usersapi/login",credObj);

      console.log(res);
      if (res.data.message === "Login Successfull") {
         //save token in session storage
         sessionStorage.setItem('token',res.data.token)
         //update state
        //navigate to user profile
       // console.log("user logged in");
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
    if (credObj.role === "author") {
        let res = await axios.post(
          "http://localhost:4000/authorsapi/login",
          credObj
        );
  
        console.log(res);
        if (res.data.message === "Login Successfull") {
          //navigate to user profile
         // console.log("user logged in");
          //save token in session storage
            sessionStorage.setItem('token',res.data.token)
            //update state
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
  }

  return (
    <loginContext.Provider value={{ currentUserDetails, setCurrentUserDetails, loginUser }}>
      {children}
    </loginContext.Provider>
  );
}

export default LoginProvider;