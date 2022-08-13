import React, { Component } from 'react';
import './App.css';

import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Header from './components/Header'
import 'bootstrap/dist/css/bootstrap.min.css';
import WelcomePage from './pages/WelcomePage';
import SigninPage from './pages/SigninPage'
import SignupPage from './pages/SignupPage'

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<WelcomePage />}/>
            <Route path="/login" element={<SigninPage />}/>
            <Route path="/signup" element={<SignupPage />}/>
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
