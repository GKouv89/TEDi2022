import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Header from './components/Header'
import 'bootstrap/dist/css/bootstrap.min.css';
import WelcomePage from './pages/WelcomePage';
import SigninPage from './pages/SigninPage'
import SignupPage from './pages/SignupPage'
import PendingPage from './pages/PendingPage'
import AdminPage from './pages/AdminPage'

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute'

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <AuthProvider>
            <Header />
            <Routes>
              <Route path="/" element={<WelcomePage />}/>
              <Route path="/login" element={<SigninPage />}/>
              <Route path="/signup" element={<SignupPage />}/>
              <Route element={<PrivateRoute />}>
                <Route path="/pending" element={<PendingPage />} />
              </Route>
              <Route path="/admin" element={<AdminPage />} /> // This shall become a protected route once we're done with auth
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
