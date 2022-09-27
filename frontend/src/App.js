import React, { Component, useContext } from 'react';
import './App.css';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import {BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Header from './components/Header'
import 'bootstrap/dist/css/bootstrap.min.css';
import WelcomePage from './pages/WelcomePage';
import SigninPage from './pages/SigninPage'
import SignupPage from './pages/SignupPage'
import PendingPage from './pages/PendingPage'
import AdminPage from './pages/AdminPage'
import IndexPage from './pages/IndexPage'
import ItemBids from './pages/Auctions/ItemBids'
import HomePage from './pages/HomePage';

import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/VisibleAlert';
import { PaginationProvider } from './context/PaginationContext';
import { UnreadMessagesProvider } from './context/UnreadMessages';
import PrivateRoute from './utils/PrivateRoute'
import ApprovedUserRoute from './utils/ApprovedUserRoute'
import UnauthorizedPage from './pages/Warnings/WarningPage';
import AuctionManagement from './pages/Auctions/AuctionManagement';
import AuctionSearch from './pages/Auctions/AuctionSearch';
import NewAuction from './pages/Auctions/NewAuction';
import AdminRoute from './utils/AdminRoute';
import EditAuction from './pages/Auctions/EditAuction';
import { SearchProvider } from './context/SearchContext';
import ItemPage from './pages/Auctions/ItemPage'

import '@fontsource/roboto/400.css';
import MessagingPage from './pages/Messages/MessagingPage';
import { RecommendedPage } from './pages/RecommendedPage';
import { MassFileExportPage } from './pages/MassFileExportPage';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AlertProvider>
          <BrowserRouter>
            <AuthProvider>
              <UnreadMessagesProvider>
              <SearchProvider>
                <PaginationProvider>
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />}/>
                  <Route path="/login" element={<SigninPage />}/>
                  <Route path="/signup" element={<SignupPage />}/>
                  <Route path="/auctions" element={<AuctionSearch />} />
                    <Route path="/auctions/:auctionid" element={<ItemPage />} />
                  <Route element={<PrivateRoute />}>
                    <Route element={<AdminRoute />}>
                      <Route path="/admin" element={<AdminPage />}/>
                      <Route path="/massexport" element={<MassFileExportPage />} />
                    </Route>
                    <Route element={<ApprovedUserRoute />}>
                      <Route path="/index" element={<IndexPage />}/>
                      <Route path="/auctionmanagement" element={<AuctionManagement />} />
                      <Route path="/auctionmanagement/ItemBids" element={<ItemBids />} />
                      <Route path="/auctionmanagement/EditAuction" element={<EditAuction />} />
                      <Route path="/messages" element={<MessagingPage />} />
                      <Route path="/recommendations" element={<RecommendedPage />} />
                    </Route>
                    <Route path="/pending" element={<PendingPage />} />
                  </Route>
                  <Route path="/warning" element={<UnauthorizedPage />} />
                  <Route path="/newauction" element={<NewAuction />} /> // The url will change once I'm done with the form to /auctions/new and will be nested
                </Routes>
                </PaginationProvider>
              </SearchProvider>
              </UnreadMessagesProvider>
            </AuthProvider>
          </BrowserRouter>
        </AlertProvider>
      </div>
    );
  }
}

export default App;
