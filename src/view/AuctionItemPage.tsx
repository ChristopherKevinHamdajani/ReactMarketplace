import React, {useEffect} from "react";
import styles from "../style/AuctionItemPage.module.css";
import FormData from 'form-data'
import axios from "axios";
import {Delete, Edit} from "@mui/icons-material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import defaultPicture from '../assets/blank-profile-picture.png'
import {useUserStore} from "../store";
import userApi from '../api/userApi';
import userImageApi from '../api/userImageApi';
import {
    Avatar,
    Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, InputAdornment, Stack, TextField, Typography
} from "@mui/material";
import CSS from 'csstype';
import styled from "@emotion/styled";
import {useNavigate,useParams} from "react-router-dom";
import Navbar from "../components/Navbar";
import auctionApi from "../api/auctionApi";
import AuctionItemObject from "../components/AuctionItemObject";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

interface IUserProps {
    user: User
}

interface Categories {
    categoryId: number
    name: string
}

const Input = styled('input')({
    display: 'none',
});

const AuctionItemPage = () => {
    const navigate=useNavigate();
    const params = useParams();
    const [allCategories, setAllCategories] = React.useState<Categories[]>([]);
    const [similarItems, setSimilarItems] = React.useState<Array<AuctionsItem>>([])
    const [bidders, setBidders] = React.useState<Array<Bidder>>([])
    const [errorMessage, setErrorMessage] = React.useState("");
    const [errorBidMessage, setErrorBidMessage] = React.useState("");
    const [theBid, setTheBid] = React.useState("");
    let userLoggedIn :UserLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn") as string)
    const defaultItem : AuctionsItem = {"auctionId": -1, "categoryId": -1,
        "description": "",
        "endDate": "",
        "highestBid": -1,
        "numBids": -1,
        "reserve": -1,
        "sellerFirstName": "",
        "sellerId": -1,
        "sellerLastName": "",
        "title": ""}
    const [item, setItem] = React.useState<AuctionsItem>(defaultItem);
    const [imageUrl, setImageUrl] = React.useState("");
    const userCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "328px",
        width: "300px",
        margin: "10px",
        padding: "0px"
    }

    const getCategoryItem = () => {
        for(let i =0; i < allCategories.length; i++){
            if(allCategories[i].categoryId === item.categoryId){

                return allCategories[i].name;
                break
            }
        }
    };

    const getEndDate = (datetime:string) => {
        const theDate = new Date(datetime);
        let date;
        if(theDate.getDate()<10){
            date = "0"+theDate.getDate()+' ';
        } else{
            date = theDate.getDate()+' ';
        }

        if(theDate.getMonth()+1 == 1){
            date += " January "
        } else if(theDate.getMonth()+1 == 2){
            date += " February "
        } else if(theDate.getMonth()+1 == 3){
            date += " March "
        } else if(theDate.getMonth()+1 == 4){
            date += " April "
        } else if(theDate.getMonth()+1 == 5){
            date += " May "
        } else if(theDate.getMonth()+1 == 6){
            date += " June "
        } else if(theDate.getMonth()+1 == 7){
            date += " July "
        } else if(theDate.getMonth()+1 == 8){
            date += " August "
        } else if(theDate.getMonth()+1 == 9){
            date += " September "
        } else if(theDate.getMonth()+1 == 10){
            date += " October "
        } else if(theDate.getMonth()+1 == 11){
            date += " November "
        } else if(theDate.getMonth()+1 == 12){
            date += " December "
        }

        date += theDate.getFullYear()

        if(theDate.getMinutes() < 10){
            date += " at "+theDate.getHours()+":0"+theDate.getMinutes()
        } else {
            date += " at "+theDate.getHours()+":"+theDate.getMinutes()
        }


        return date;
    };



    React.useEffect(() => {
        userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn") as string)
        document.title ="Auction Item Page"
        const pathname = window.location.pathname;
        const myArray = pathname.split("/");
        const getAuctionId = parseInt(myArray[2]);
        console.log(getAuctionId)
        const getItem =  () => {
            auctionApi.getSingleAuction(getAuctionId)
                .then((response) => {
                    console.log(response.data)
                    setItem(response.data)
                    auctionApi.getAllAuctionsWithData("http://localhost:4941/api/v1/auctions?categoryIds="+response.data.categoryId+"?sellerId="+response.data.sellerId)
                        .then((response) => {

                            setSimilarItems(response.data.auctions);
                        }, (error) => {
                            if(error.response.status === 401){
                                setErrorMessage("You must log in first!")
                            } else {

                                setErrorMessage(error.toString()+"something went wrong with the category")
                            }
                        })
                }, (error) => {

                })
        }
        auctionApi.getAllCategories()
            .then((response) => {
                setAllCategories(response.data);
            }, (error) => {
                if(error.response.status === 401){
                    setErrorMessage("You must log in first!")
                } else {

                    setErrorMessage(error.toString())
                }
            })
        auctionApi.getBidders(getAuctionId)
            .then((response) => {
                setBidders(response.data)
            }, (error) => {
                if(error.response.status === 401){
                    setErrorMessage("You must log in first!")
                } else {
                    setErrorMessage(error.toString())
                }
            })

        getItem()


    }, [])

    const bidder_rows = () => {
        if(bidders.length === 0){
            return (
                <div>
                    <h1 style={{color:"red"}}>OH NO! NO BIDDER?</h1>
                    <h1 style={{color:"red"}}>BE THE FIRST BIDDER!!!</h1>
                </div>

            )
        } else {
            return bidders.map((bidder: Bidder) =>
                <div className={styles.each_bidder}>
                    <Avatar sx={{ width: 60, height: 60 }} alt={bidder.firstName} src={"http://localhost:4941/api/v1/users/"+bidder.bidderId+"/image"} />
                    <p>{bidder.firstName} {bidder.lastName}</p>
                    <p>{getEndDate(bidder.timestamp)}</p>
                    <p>${bidder.amount}</p>
                </div>)
        }

        }



    const similar_rows = () => {
        const temp = similarItems.filter(auction => auction.auctionId != item.auctionId)
        if(temp.length === 0){
            return (
                <div>
                    <h1 style={{color:"red"}}>Sorry no similar items found</h1>
                </div>
            )
        } else {
            return temp.map((item: AuctionsItem) =>
                <AuctionItemObject key={item.auctionId + item.title} item={item} id={item.auctionId}/>)
        }

    }

    const bid_card = () => {
        const itemEndDate = new Date(item.endDate)
        const today = new Date();
        if(userLoggedIn === null){
            return (
                <Typography variant="h4" style={{fontWeight:"bold", color:"red"}}>
                    Please Register or Sign Up to Place A Bid!
                </Typography>
            )
        } else if(itemEndDate < today){
            return (
                <Typography variant="h4" style={{fontWeight:"bold", color:"gray"}}>
                    This auction has closed
                </Typography>
            )
        } else {
            return (
                <div>
                    <TextField
                        id="outlined-error"
                        label="Your Bid Amount"
                        className = {styles.text_field_input}
                        onChange={(event) => {setTheBid(event.target.value)}}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="end">
                                    <MonetizationOnIcon/>
                                </InputAdornment>
                            )
                        }}
                    />
                    <div className={styles.error_box} style={errorBidMessage===""?{display:'none'}:{display:'', color:"red"}} onClick={() => setErrorMessage("")}>
                        {errorBidMessage}
                    </div>
                    <Button className={styles.button_bid} onClick={() => {
                        place_bid()
                    }}>
                        Bid
                    </Button>
                </div>

            )
        }

    }

    const getItemPicture = () => {
        auctionApi.getAuctionImage(item.auctionId)
            .then((response) => {
                const current_image_url = "http://localhost:4941/api/v1/auctions/"+item.auctionId+"/image"
                setImageUrl(current_image_url)
            }, (error) => {
                if(error.response.status === 404 || error.response.status === 500 ){
                    setImageUrl("")
                }
                else{
                    setImageUrl("")
                }
            })

    };

    function isInt(n:number){
        return Number(n) === n && n % 1 === 0;
    }


    const place_bid = () => {
        setErrorBidMessage("")
        if(!isInt(Number(theBid))){
            setErrorBidMessage("The value must be a number without fraction")
        } else if (Number(theBid) <= item.highestBid){
            setErrorBidMessage("You need to bid higher!")
        } else {
            auctionApi.postBid(item.auctionId, {"amount":Number(theBid)},userLoggedIn.token)
                .then((response) => {
                    if(response.status === 201){
                        console.log("nicee one")
                        setTheBid("")
                        window.location.reload()
                    }
                }, (error) => {
                    if(error.response.status === 404 || error.response.status === 500 ){
                        setErrorBidMessage("something went wrong!")
                    }
                    else{
                        setErrorBidMessage("something went wrong!")
                    }
                })
        }
    };

    getItemPicture();
    return (
        <div>
            <Navbar/>
            <div className={styles.main_container}>
                <div className={styles.auction_detail}>
                    <div className={styles.auction_detail_image}>
                        <img src={imageUrl===""?"https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg":imageUrl}/>
                        <Chip label={getCategoryItem()} color="success" className={styles.category_chip} />
                    </div>
                    <div className={styles.auction_detail_info}>
                        <Box
                            component="form"
                            sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}}
                            noValidate
                            autoComplete="off"
                            className={styles.register_box}
                        >
                            <div className={styles.auction_details_info_desc}>
                                <h1 className={styles.item_title}>{item.title}</h1>
                                <p className={styles.item_desc}>{item.description}</p>
                                <p>Number of Bids(s): {item.numBids}</p>
                                <p >Reserve:${item.reserve}</p>
                                <p style={{fontWeight:"bold"}}> This auction close on {getEndDate(item.endDate)}</p>
                            </div>
                            <div className={styles.auction_details_info_desc}>
                                <p className={styles.text_seller}>Seller Information:</p>
                                <div className={styles.footer_left}>
                                    <Avatar sx={{ width: 60, height: 60 }} alt={item.sellerFirstName} src={"http://localhost:4941/api/v1/users/"+item.sellerId+"/image"} />
                                    <p>{item.sellerFirstName}</p>
                                    <p>{item.sellerLastName}</p>

                                </div>
                            </div>

                        </Box>
                    </div>

                    <div className={styles.bid_card} style={userLoggedIn!== null && item.sellerId === userLoggedIn.userId?{display:'none'}:{display:''}}>
                        <Box
                            component="form"
                            sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}}
                            noValidate
                            autoComplete="off"
                            className={styles.register_box}
                        >
                            <Typography variant="h2" style={{fontWeight:"bold"}}>
                                Place Your Bid
                            </Typography>
                            <div>
                                {bid_card()}

                            </div>

                        </Box>
                    </div>
                </div>
            </div>
            <div className={styles.below_container}>
                <div className={styles.bidders_container}>
                    <h1>Bidders</h1>
                    {bidder_rows()}
                </div>
                <div className={styles.similar_container}>
                    <h1>Similar Items</h1>
                    {similar_rows()}
                </div>
            </div>
        </div>
    )
}
export default AuctionItemPage