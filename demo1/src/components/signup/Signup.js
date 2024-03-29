import { useForm } from "react-hook-form";
import axios from 'axios'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  let { register, handleSubmit } = useForm();
  let [err, setErr] = useState('')
  let navigate = useNavigate()

  async function onRegister(obj) {
    console.log(obj)

    if (obj.role === 'user') {
      let res = await axios.post('http://localhost:4000/usersapi/register', obj)
      console.log(res)
      if (res.data.message === "User created") {
        console.log("user registation sucess")
        navigate('/signin')
        setErr('')

      }
      else {
        setErr(res.data.message)
      }
    }
    if (obj.role === 'author') {
      let res = await axios.post('http://localhost:4000/authorsapi/register', obj)
      console.log(res)
      if (res.data.message === "Author Added.") {
        console.log("Author registation sucess")
        navigate('/signin')
        setErr('')

      }
      else {
        setErr(res.data.message)
      }
    }
  }

  return (
    <div>
      <p className="display-3 text-center text-info">SignUp</p>

      {err.length !== 0 && <p className="text-danger text-center fs-4">{err}</p>}
      <form className="w-50 bg-light p-3 m-auto mt-5" onSubmit={handleSubmit(onRegister)}>
        {/* two radios for user role */}
        <div className="mb-3">
          <label>Register as</label>
          <div className="form-check">
            <input
              type="radio"
              {...register("role")}
              value="user"
              id="user"
              className="form-check-input"
            />
            <label htmlFor="user" className="form-check-label">User</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              {...register("role")}
              value="author"
              id="author"
              className="form-check-input"
            />
            <label htmlFor="author" className="form-check-label">Author</label>
          </div>
        </div>
        {/* username */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Username</label>
          <input type="text" {...register("name")} id="name" className="form-control" />
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