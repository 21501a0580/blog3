import { useForm } from "react-hook-form";
import axios from 'axios'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  let { register, handleSubmit } = useForm();
  let [err, setErr] = useState('')
  let navigate = useNavigate()

  async function onRegister(obj) {
      let res = await axios.post('http://localhost:4000/usersapi/register', obj)
      if (res.data.message === "Signup Successfull") {
        navigate('/signin')
        setErr('')
      }
      else {
        setErr(res.data.message)
      }
  }

  return (
    <div>
      <p className="display-3 text-center text-info">SignUp</p>

      {err.length !== 0 && <p className="text-danger text-center fs-4">{err}</p>}
      <form className="w-50 bg-light p-3 m-auto mt-5" onSubmit={handleSubmit(onRegister)}>
        {/* username */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" {...register("username")} id="username" className="form-control" />
        </div>
        {/* password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" {...register("password")} id="password" className="form-control" />
        </div>
        {/* email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" {...register("email")} id="email" className="form-control" />
        </div>
        {/* submit button */}
        <button type="submit" className="btn btn-success">Register</button>
      </form>
    </div>
  );
}

export default Signup;