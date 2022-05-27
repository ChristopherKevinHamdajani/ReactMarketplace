import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "./view/LoginPage";
import RegisterPage from "./view/RegisterPage";
import AuctionPage from "./view/AuctionPage";
import Navbar from "./components/Navbar";
import ProfilePage from "./view/ProfilePage";
import EditProfilePage from "./view/EditProfilePage";
import UpdateUserSuccess from "./view/UpdateUserSuccessPage";
import AuctionItemPage from "./view/AuctionItemPage";
import MyAuctionsPage from "./view/MyAuctionsPage";
import AddAuctionPage from "./view/AddAuctionPage";
function App() {
  return (
      <div className="App">
          {/*<Navbar/>*/}
        <Router>
          <div>
            <Routes>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/*" element={<AuctionPage/>}/>
                <Route path="/userprofile" element={<ProfilePage/>}/>
                <Route path="/editprofile" element={<EditProfilePage/>}/>
                <Route path="/updateusersuccess" element={<UpdateUserSuccess/>}/>
                <Route path="/auctionitem/:auctionId" element={<AuctionItemPage/>}/>
                <Route path="/myauctions" element={<MyAuctionsPage/>}/>
                <Route path="/addauction" element={<AddAuctionPage/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}
export default App;