import React, { Component } from 'react';
import './App.css';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

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
import { AlertProvider } from './context/VisibleAlert';
import PrivateRoute from './utils/PrivateRoute'
import ApprovedUserRoute from './utils/ApprovedUserRoute'
import UnauthorizedPage from './pages/Warnings/WarningPage';
import AuctionManagement from './pages/Auctions/AuctionManagement';
import AuctionSearch from './pages/Auctions/AuctionSearch';
import NewAuction from './pages/Auctions/NewAuction';
import AdminRoute from './utils/AdminRoute';

class App extends Component {
  render() {
    return (
      <div className="App">
<<<<<<< HEAD
        <AlertProvider>
        <BrowserRouter>
        
          <AuthProvider>
            <Header />
            <Routes>
              <Route path="/" element={<WelcomePage />}/>
              <Route path="/login" element={<SigninPage />}/>
              <Route path="/signup" element={<SignupPage />}/>
              <Route element={<PrivateRoute />}>
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminPage />}/>
                </Route>
                <Route element={<ApprovedUserRoute />}>
                  <Route path="/index" element={<IndexPage />}/>
                  <Route path="/auctionmanagement" element={<AuctionManagement />} />
                  <Route path="/auctions" element={<AuctionSearch />} />
                </Route>
                <Route path="/pending" element={<PendingPage />} />
              </Route>
              <Route path="/warning" element={<UnauthorizedPage />} />
            </Routes>
          </AuthProvider>
        
        </BrowserRouter>
        </AlertProvider>
=======
        {/* <LocalizationProvider dateAdapter={AdapterMoment}>         */}
          <BrowserRouter>
            <AuthProvider>
              <Header />
              <Routes>
                <Route path="/" element={<WelcomePage />}/>
                <Route path="/login" element={<SigninPage />}/>
                <Route path="/signup" element={<SignupPage />}/>
                <Route element={<PrivateRoute />}>
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminPage />}/>
                  </Route>
                  <Route element={<ApprovedUserRoute />}>
                    <Route path="/index" element={<IndexPage />}/>
                    <Route path="/auctionmanagement" element={<AuctionManagement />} />
                    <Route path="/auctions" element={<AuctionSearch />} />
                  </Route>
                  <Route path="/pending" element={<PendingPage />} />
                </Route>
                <Route path="/warning" element={<UnauthorizedPage />} />
                <Route path="/newauction" element={<NewAuction />} /> // The url will change once I'm done with the form to /auctions/new and will be nested
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        {/* </LocalizationProvider> */}
>>>>>>> a1267854b7644c5724a99d99f0cfd46de3d75589
      </div>
    );
  }
}

export default App;
