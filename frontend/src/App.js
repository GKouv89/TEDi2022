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
import IndexPage from './pages/IndexPage'

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute'
import UnauthorizedPage from './pages/Warnings/WarningPage';
import AuctionManagement from './pages/Auctions/AuctionManagement';
import AuctionSearch from './pages/Auctions/AuctionSearch';

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
                <Route path="/admin" element={<AdminPage />}/>
                <Route path="/pending" element={<PendingPage />} />
                <Route path="/auctionmanagement" element={<AuctionManagement />} />
                <Route path="/auctions" element={<AuctionSearch />} />
              </Route>
              <Route path="/warning" element={<UnauthorizedPage />} />
              <Route path="/index" element={<IndexPage />}/> /* Temporary, this will become a protected route*/
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
