import { useForm } from "react-hook-form";
import { useContext, useEffect } from "react";
import { loginContext } from "../../contexts/LoginContextProvider";
import { useNavigate } from "react-router-dom";

function Signin() {
  let { register, handleSubmit } = useForm();
  let navigate = useNavigate();
  const { currentUserDetails, loginUser } =
    useContext(loginContext);

  function onLogin(credObj) {
    loginUser(credObj);
  }

  useEffect(() => {
      if (currentUserDetails.userLoginStatus === true) {
        navigate("/user-profile");
      }
  }, [currentUserDetails.userLoginStatus,currentUserDetails,navigate]);

  return (
    <div>
      <p className="display-3 text-center text-info">Signin</p>
      {currentUserDetails.err.length !== 0 && (
        <p className="text-danger fs-3 text-center">{currentUserDetails.err}</p>
      )}
      <form
        className="w-50 bg-light p-3 m-auto mt-5"
        onSubmit={handleSubmit(onLogin)}
      >
        {/* username */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            {...register("username")}
            id="username"
            className="form-control"
          />
        </div>
        {/* password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            id="password"
            className="form-control"
          />
        </div>

        {/* submit button */}
        <button type="submit" className="btn btn-success">
          Login
        </button>
      </form>
    </div>
  );
}

export default Signin;