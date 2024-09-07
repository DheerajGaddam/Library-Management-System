import "./App.css";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./form/Login";
import Register from "./form/Register";
import Home from "./Home";
import ClientDashboard from "./ClientDashboard";
import LibrarianDashboard from "./LibrarianDashboard";
import BookList from "./components/BookList";
import MagazineList from "./components/MagazineList";
import JournalList from "./components/JournalList";
import AddDocument from "./components/AddDocument";
import ClientList from "./components/ClientList";
import ClientDocuments from "./components/ClientDocuments";
import PaymentForm from "./components/PaymentForm";
import Due from "./components/Due";
import Navbar from "./components/Navbar";

function App() {
  const [token, setToken] = useState(localStorage.getItem("auth_token"));
  const [userType, setUserType] = useState();

  useEffect(() => {
    if (token) {
      getUserType(token);
    }
  }, [token]);

  const getUserType = async (authToken) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/library/api/v1/login/test-token', null, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setUserType(response.data.user_type);
    } catch (error) {
      console.log('Error getting user type:', error);
    }
  };

  return (
    <Router>
      <Navbar token={token} userType={userType}/>
      <div className="container mt-3">
        <Routes>
          <Route path="/login" element={token ? <Navigate replace to="/" /> : <Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} /> {/* Register accessible regardless of token */}
          <Route path="/" element={token ? <Home /> : <Navigate replace to="/login" />} />
          {token && userType === 'librarian' && <Route path="/books" element={<BookList />} />}
          {token && userType === 'librarian' && <Route path="/magazines" element={<MagazineList />} />}
          {token && userType === 'librarian' && <Route path="/journals" element={<JournalList />} />}
          {token && userType === 'librarian' && <Route path="/add" element={<AddDocument />} />}
          {token && userType === 'librarian' && <Route path="/clients" element={<ClientList />} />}

          {token && userType === 'client' && <Route path="/client-dashboard" element={<ClientDashboard />} />}
          {token && userType === 'client' && <Route path="/library" element={<ClientDocuments />} />}
          {token && userType === 'client' && <Route path="/due" element={<Due />} />}
          {token && userType === 'client' && <Route path="/payment" element={<PaymentForm />} />}
          {token && userType === 'librarian' && <Route path="/librarian-dashboard" element={<LibrarianDashboard />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
