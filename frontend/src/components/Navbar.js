import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ token, userType }) => {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <Link to="/" className="navbar-brand" style = {{marginLeft:20, fontWeight: 'bold'}} >
        Library Management System
      </Link>
      {token && (
        <div className="navbar-nav mr-auto">
          {userType === 'librarian' && (
            <>
              <li className="nav-item">
                <Link to="/books" className="nav-link">
                  Books
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/magazines" className="nav-link">
                  Magazine
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/journals" className="nav-link">
                  Journals
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/add" className="nav-link">
                  Add Documents
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/clients" className="nav-link">
                  Clients
                </Link>
              </li>
            </>
          )}
          {userType === 'client' && (
            <>
             <li className="nav-item">
                <Link to="/library" className="nav-link">
                  Library
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/due" className="nav-link">
                  Due
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/payment" className="nav-link">
                  Payment
                </Link>
              </li>
            </>
          )}
          <li className="nav-item">
            <button className="btn btn-dark nav-link" onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>
              Sign Out
            </button>
          </li>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
