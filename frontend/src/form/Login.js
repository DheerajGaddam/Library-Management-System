/* eslint-disable default-case */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import '../AddTutorial.css'; // Add this import at the top of your file


export default function Login(props) {
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const onChangeForm = (label, event) => {
    switch (label) {
      case "username":
        setLoginForm({ ...loginForm, username: event.target.value });
        break;
      case "password":
        setLoginForm({ ...loginForm, password: event.target.value });
        break;
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    var bodyFormData = new FormData();
    bodyFormData.append("username", loginForm.username);
    bodyFormData.append("password", loginForm.password);

    try {
      const response = await axios({
        method: "post",
        url: "http://127.0.0.1:8000/library/api/v1/login/access-token",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      localStorage.setItem("auth_token", response.data.access_token);
      props.setToken(response.data.access_token); // Assuming setToken is passed as a prop
      toast.success("Logged in successfully!");
      getUserType(response.data.access_token);
    } catch (error) {
      toast.error("Login failed!");
    }
  };

  const getUserType = async (authToken) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/library/api/v1/login/test-token",
        null,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (response.data.user_type === "client") {
        navigate("/client-dashboard"); // Redirect to client dashboard
      } else if (response.data.user_type === "librarian") {
        navigate("/librarian-dashboard"); // Redirect to librarian dashboard
      } else {
        navigate("/"); // Redirect to default page
      }
    } catch (error) {
      console.log("Error getting user type:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="submit-form" style={{marginTop: 150}}>
        <h1 className="text-3xl font-bold text-center mb-4">Login</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-yellow-400"
              onChange={(event) => {
                onChangeForm("username", event);
              }}
            />
            <input
              type="password"
              placeholder="Password"
              className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-yellow-400"
              onChange={(event) => {
                onChangeForm("password", event);
              }}
            />
          </div>
          <div className="text-center mt-6">
            <button
              type="submit"
              className="py-3 w-64 text-xl text-white bg-green-400 rounded-2xl hover:bg-yellow-300 active:bg-yellow-500 outline-none"
            >
              Sign In
            </button>
            <p className="mt-4 text-sm">
              You don't have an account?{" "}
              <Link to="/register">
                <span className="underline cursor-pointer">Register</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}
