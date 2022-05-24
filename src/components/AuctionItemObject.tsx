import React from "react";
import axios from "axios";
import {Delete, Edit} from "@mui/icons-material";
import {useUserStore} from "../store";
import {
    Avatar,
    Button, Card, CardActions, CardContent, CardMedia, Chip, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, TextField, Typography
} from "@mui/material";
import CSS from 'csstype';
import auctionApi from "../api/auctionApi";
import defaultPicture from "../assets/blank-profile-picture.png";
import styles from "../style/AuctionObject.module.css";
import {blob} from "stream/consumers";
import Compressor from 'compressorjs';
import {useNavigate} from "react-router-dom";


interface AuctionItemProps {
    item: AuctionsItem
    id: number
}

interface Categories {
    categoryId: number
    name: string
}
const AuctionItemObject = (props: AuctionItemProps) => {
    const [item] = React.useState<AuctionsItem>(props.item)
    const [openEditDialog, setOpenEditDialog] = React.useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [allCategories, setAllCategories] = React.useState<Categories[]>([]);
    const [itemCategory, setItemCategory] = React.useState("");
    const [remainingDays, setRemainingDays] = React.useState(-1)
    const [errorMessage, setErrorMessage] = React.useState("");
    let userLoggedIn :UserLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn") as string)
    const [imageUrl, setImageUrl] = React.useState("");
    const navigate=useNavigate();

    const calculateRemainingDays = (closingDate : any) => {
        const today = new Date();
        const closeDate = new Date(closingDate);
        const remaining_milliseconds = closeDate.getTime() - today.getTime();
        let remaining_days = remaining_milliseconds / 86400000;
        if(remaining_days < 0){
            remaining_days = Math.ceil(remaining_days)
        } else {
            remaining_days = Math.floor(remaining_days)
        }
        setRemainingDays(remaining_days);
    };

    React.useEffect(() => {
        userLoggedIn =JSON.parse(localStorage.getItem("userLoggedIn") as string)
        calculateRemainingDays(item.endDate);
        auctionApi.getAuctionImage(item.auctionId)
            .then((response) => {

                if(response.status === 200){
                    const current_image_url = "http://localhost:4941/api/v1/auctions/"+item.auctionId+"/image"
                    setImageUrl(current_image_url)

                }

            }, (error) => {
                if(error.response.status === 401){
                    setErrorMessage("You must log in first!")
                } else if (error.response.status === 500){
                    setImageUrl("")
                } else {
                    setErrorMessage(error.toString()+"something wen twrong with the getting the auction")
                }
            })


        auctionApi.getAllCategories()
            .then((response) => {
                setAllCategories(response.data);
            }, (error) => {
                if(error.response.status === 401){
                    setErrorMessage("You must log in first!")
                } else {

                    setErrorMessage(error.toString()+"something went wrong with the category")
                }
            })

    }, [])

    const userCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "400px",
        width: "300px",
        margin: "10px",
        padding: "0px",
        textAlign:"left",
    }

    const getCategoryItem = () => {
        for(let i =0; i < allCategories.length; i++){
            if(allCategories[i].categoryId === item.categoryId){

                return allCategories[i].name;
                break
            }
        }
    };

    return (
        <Card sx={userCardStyles} className={styles.container_item} onClick={()=>{navigate("/auctionitem/"+item.auctionId);window.location.reload()}}>
            <div className={styles.error_box} style={errorMessage===""?{display:'none'}:{display:''}} onClick={() => setErrorMessage("")}>
                {errorMessage}
            </div>
            <CardMedia
                component="img"
                height="200"
                width="200"
                sx={{objectFit:"cover"}}
                image={imageUrl===""?"https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg":imageUrl}
                alt="User hero image"
            />
            {/*<img src={imageUrl===""?"https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg":imageUrl} alt="" style={{height: "200px",width: "200px"}}/>*/}
            <CardContent>
                <Typography variant="h5">
                    {item.title}
                </Typography>
                {/*remaining days*/}
                <Typography variant="subtitle2" style={remainingDays>1?{display:'', color:"green"}:{display:'none'}}>
                    Closing in {remainingDays} days
                </Typography>
                <Typography variant="subtitle2" style={remainingDays===1?{display:'', color:"red"}:{display:'none'}}>
                    Auction closes tomorrow!
                </Typography>
                <Typography variant="subtitle2" style={remainingDays<1?{display:'', color:"gray"}:{display:'none'}}>
                    Auction closed
                </Typography>

                {/*current highest bid*/}
                <Typography variant="subtitle2" style={item.numBids !== 0?{display:'', color:"black"}:{display:'none'}}>
                    Highest bid: ${item.highestBid}
                </Typography>
                <Typography variant="subtitle2" style={item.numBids === 0 && remainingDays > 0?{display:'', color:"red"}:{display:'none'}}>
                    Be the first bidder for this item!
                </Typography>

                <div className={styles.footer_card}>
                    <div className={styles.footer_left}>
                        <Avatar alt={item.sellerFirstName} src={"http://localhost:4941/api/v1/users/"+item.sellerId+"/image"} />
                        <div>
                            <p>{item.sellerFirstName}</p>
                            <p>{item.sellerLastName}</p>
                        </div>

                    </div>
                    <div className={styles.footer_right}>
                        <p>Reserve:</p>
                        <p>${item.reserve}</p>
                        <p style={item.highestBid >= item.reserve?{display:''}:{display:'none'}}>Reserve Met!</p>
                    </div>

                </div>

                <Chip label={getCategoryItem()} color="success" className={styles.category_chip} />

            </CardContent>
            <CardActions>

            </CardActions>
        </Card>
    )
}
export default AuctionItemObject