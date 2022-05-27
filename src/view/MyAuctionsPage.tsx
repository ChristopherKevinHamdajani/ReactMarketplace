import axios from 'axios';
import React from "react";
import CSS from 'csstype';
import {Paper, AlertTitle, Alert, alpha, styled, TextField, InputAdornment, Button} from "@mui/material";
import AuctionItemObject from "../components/AuctionItemObject";
import {useUserStore} from "../store";
import auctionApi from '../api/auctionApi';
import Navbar from "../components/Navbar";
import {Search} from "@mui/icons-material";
import styles from "../style/AuctionPage.module.css";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SearchIcon from '@mui/icons-material/Search';
import MyAuctionItemObject from "../components/MyAuctionItemObject";
import {useNavigate} from "react-router-dom";

const AuctionPage = () => {
    const navigate=useNavigate();
    const [items, setItems] = React.useState<Array<AuctionsItem>>([])
    const [biddedItems, setBiddedItems] = React.useState<Array<AuctionsItem>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    let userLoggedIn :UserLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn") as string)

    React.useEffect(() => {
        userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn") as string)
        const getItems = () => {
            auctionApi.getAllAuctionsWithData("http://localhost:4941/api/v1/auctions?sellerId="+userLoggedIn.userId)
                .then((response) => {
                    setItems(response.data.auctions)
                }, (error) => {
                    if(error.response.status === 401){
                        setErrorMessage("You must log in first!")
                    } else {

                        setErrorMessage(error.toString()+"something went wrong with the category")
                    }
                })
            auctionApi.getAllAuctionsWithData("http://localhost:4941/api/v1/auctions?bidderId="+userLoggedIn.userId)
                .then((response) => {
                    setBiddedItems(response.data.auctions)
                }, (error) => {
                    if(error.response.status === 401){
                        setErrorMessage("You must log in first!")
                    } else {

                        setErrorMessage(error.toString()+"something went wrong with the category")
                    }
                })
        }
        getItems()
    }, [setItems])
    const item_rows = () => items.map((item: AuctionsItem) =>
        <MyAuctionItemObject key={item.auctionId + item.title} item={item} id={item.auctionId}/>)
    const item_bidded_rows = () => biddedItems.map((item: AuctionsItem) =>
        <AuctionItemObject key={item.auctionId + item.title} item={item} id={item.auctionId}/>)
    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        width: "fit-content"
    }
    return (
        <div className="main-container">
            <Navbar/>
            {/*<div className={styles.top_bar}>*/}
            {/*    */}
            {/*</div>*/}

            <h1>My Items</h1>
            <div style={{display:"inline-block", maxWidth:"95%", minWidth:"320"}}>
                {errorFlag? <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                    :""}
                {items.length === 0?<h1 style={{color:"red"}}>You have not put any item on auction</h1>:item_rows()}

            </div>
            <div>
                <Button className={styles.button_signup} onClick={()=>{navigate("/addauction")}}>
                    Add More Item
                </Button>
            </div>

            <h1>Items I Have Bid On</h1>
            <div style={{display:"inline-block", maxWidth:"95%", minWidth:"320"}}>
                {errorFlag? <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                    :""}
                {biddedItems.length === 0?<h1 style={{color:"red"}}>Yo have not bid on any item</h1>:item_bidded_rows()}

            </div>
        </div>
    )
}
export default AuctionPage;