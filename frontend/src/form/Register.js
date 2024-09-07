/* eslint-disable default-case */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Register(props) {
  const navigate = useNavigate();

  const [role, setRole] = useState('client'); // Default to 'client'
  const [formData, setFormData] = useState({
    user_type: 'client', // Initialize user_type as 'client'
    email: '',
    name: '',
    password: '',
    address: ''  // Client specific field
  });

  const onChangeRole = (event) => {
    const newRole = event.target.value;
    setRole(newRole);
    // Reset formData when role changes, initializing with role-specific fields
    if (newRole === 'client') {
      setFormData({
        user_type: newRole,
        email: '',
        name: '',
        password: '',
        address: ''
      });
    } else if (newRole === 'librarian') {
      setFormData({
        user_type: newRole,
        email: '',
        name: '',
        password: '',
        ssn: '',
        salary: ''
      });
    }
  };

  const onChangeForm = (key, event) => {
    setFormData({ ...formData, [key]: event.target.value });
  };
 

  //   Submit handler

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formData);
    // Post to register API
    await axios
      .post("http://127.0.0.1:8000/library/api/v1/users/test", formData)
      .then((response) => {
        // move to sign in page
        navigate("/?signin");

        // add successfully notif
        toast.success(response.data.detail);
        // reload page
        setTimeout(() => {
          window.location.reload();
        }, 1000);

        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        // add error notif
        toast.error(error.response.data.detail);
      });
  };

  return (
    <React.Fragment>
      <div>
        <h1 className="text-3xl font-bold text-center mb-4">
          Create An Account
        </h1>
      </div>
      <form onSubmit={onSubmitHandler}>
        <div className="space-y-4">
          <select
            required
            value={role}
            onChange={onChangeRole}
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-yellow-400"
          >
            <option value="client">Client</option>
            <option value="librarian">Librarian</option>
          </select>
          <input
            required
            type="text"
            placeholder="Name"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
            onChange={(event) => onChangeForm('name', event)}
            value={formData.name}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
            onChange={(event) => onChangeForm('email', event)}
            value={formData.email}
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
            onChange={(event) => onChangeForm('password', event)}
            value={formData.password}
          />
          {role === 'client' && (
            <input
            required
              type="text"
              placeholder="Address"
              className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
              onChange={(event) => onChangeForm('address', event)}
              value={formData.address}
            />
          )}
          {role === 'librarian' && (
            <>
              <input
                required
                type="text"
                placeholder="SSN (e.g., 444-22-6789)"
                className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
                onChange={(event) => onChangeForm('ssn', event)}
                value={formData.ssn}
                pattern="^\d{3}-\d{2}-\d{4}$"
                title="SSN must be in the format 444-22-6789"
              />
              <input
                required
                type="number"
                placeholder="Salary"
                className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
                onChange={(event) => onChangeForm('salary', event)}
                value={formData.salary}
              />
            </>
          )}
        </div>
        <div className="text-center mt-6">
          <button
            type="submit"
            className="py-3 w-64 text-xl text-white bg-green-400 rounded-2xl hover:bg-yellow-300 active:bg-yellow-500 outline-none"
          >
            Create Account
          </button>
          <p className="mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/login">
          <span className="underline cursor-pointer">Sign In</span>
        </Link>
          </p>
        </div>
      </form>
    </React.Fragment>
  );
}