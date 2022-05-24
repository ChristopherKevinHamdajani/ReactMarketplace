import React from "react";
import axios from "axios";
import {Delete, Edit} from "@mui/icons-material";
import {useUserStore} from "../store";
import {
    Avatar,
    Button, Card, CardActions, CardContent, CardMedia, Chip, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, Input, InputAdornment, Slide, Stack, TextField, Typography
} from "@mui/material";
import CSS from 'csstype';
import auctionApi from "../api/auctionApi";
import defaultPicture from "../assets/blank-profile-picture.png";
import styles from "../style/AuctionObject.module.css";
import stylesTwo from "../style/MyAuctionObject.module.css";
import {blob} from "stream/consumers";
import Compressor from 'compressorjs';
import {useNavigate} from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {TransitionProps} from "@mui/material/transitions";


interface AuctionItemProps {
    item: AuctionsItem
    id: number
}

interface Categories {
    categoryId: number
    name: string
}
const MyAuctionItemObject = (props: AuctionItemProps) => {
    const [item] = React.useState<AuctionsItem>(props.item)
    const [openEditDialog, setOpenEditDialog] = React.useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [allCategories, setAllCategories] = React.useState<Categories[]>([]);
    const [itemCategory, setItemCategory] = React.useState("");
    const [remainingDays, setRemainingDays] = React.useState(-1)
    const [selectedItem, setSelectedItem] = React.useState(-1)
    const [errorMessage, setErrorMessage] = React.useState("");
    let userLoggedIn :UserLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn") as string)
    const [imageUrl, setImageUrl] = React.useState("");
    const navigate=useNavigate();
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
    const [selectedItemFull, setSelectedItemFull] = React.useState<AuctionsItem>(defaultItem);
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
        if(userLoggedIn === null){
            navigate("/")
        } else {
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
                        setErrorMessage(error.toString())
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
        }


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

    const delete_item = () => {
        auctionApi.deleteItemAuction(selectedItem,userLoggedIn.token)
            .then((response) => {
                setSelectedItem(-1);
                window.location.reload();
            }, (error) => {
                if(error.response.status === 403){
                    setErrorMessage("Unauthorized")
                } else {
                    setErrorMessage(error.toString()+"something went wrong with the category")
                }
            })
    };

    const get_selected_item = () => {
        auctionApi.getSingleAuction(item.auctionId)
            .then((response) => {
                setSelectedItemFull(response.data)
                setSelectedItem(item.auctionId)
                setOpenEditDialog(true)
            }, (error) => {
                if(error.response.status === 403){
                    setErrorMessage("Unauthorized")
                } else {
                    setErrorMessage(error.toString()+"something went wrong")
                }
            })
    };
    console.log("helo")
    console.log(selectedItemFull)
    return (
        <Card sx={userCardStyles} className={styles.container_item} >
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

                {item.numBids !== 0 ?<div></div>:
                    <div className={styles.footer_card}>
                        <div>
                            <Button variant="contained" color="success" onClick={() => {
                                get_selected_item()

                            }}>
                                Edit
                            </Button>
                        </div>
                        <div>
                            <Button variant="contained" onClick={()=>{navigate("/auctionitem/"+item.auctionId)}}>
                                See Details
                            </Button>
                        </div>
                        <div>
                            <Button variant="contained" color="error" onClick={() => {
                                setSelectedItem(item.auctionId);
                                setOpenDeleteDialog(true)
                            }}>
                                Delete
                            </Button>
                        </div>

                    </div>
                }

                <Chip label={getCategoryItem()} color="success" className={styles.category_chip} />

            </CardContent>
            <CardActions>

            </CardActions>
            <Dialog
                open={openDeleteDialog}
                onClose={()=>{setOpenDeleteDialog(false); setSelectedItem(-1)}}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Wait what?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this auction? You can earn some money...
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{setOpenDeleteDialog(false); setSelectedItem(-1)}}>Cancel</Button>
                    <Button variant="outlined" color="error"  autoFocus onClick={()=>{delete_item()}}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                fullWidth={true}
                maxWidth={'xl'}
                open={openEditDialog}
                onClose={()=>{setOpenEditDialog(false); setSelectedItem(-1)}}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Edit Your Item"}
                </DialogTitle>
                <DialogContent style={{padding:"15px"}}>
                    <Stack direction="column" alignItems="center" spacing={2}>
                        <p className={styles.register_title}>Edit My Profile</p>
                        <img src={imageUrl===""?defaultPicture:imageUrl} alt="" className={styles.preview_image}/>
                        <label htmlFor="contained-button-file">
                            <Button variant="contained" component="span" color="success">
                                Upload Image
                            </Button>
                        </label>
                        <Button variant="contained" component="span" color="error" className={styles.button_delete_image} style={imageUrl===""?{display:'none'}:{display:''}}>
                            Delete Image
                        </Button>
                        <div className={styles.error_box} style={errorMessage===""?{display:'none'}:{display:''}} onClick={() => setErrorMessage("")}>
                            {errorMessage}
                        </div>
                        <TextField
                            id="outlined-error"
                            label="Title"
                            defaultValue={selectedItemFull.title}
                        />
                        <TextField
                            id="outlined-error"
                            label="Description"
                            defaultValue={selectedItemFull.description}
                        />
                        <TextField
                            id="outlined-error"
                            label="Email"
                        />
                        <TextField
                            id="outlined-error"
                            label="Current Password"

                        />
                        <TextField
                            id="outlined-error"
                            label="New Password"

                        />
                        <Button className={styles.button_edit} >
                            Update profile
                        </Button>

                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{setOpenEditDialog(false); setSelectedItem(-1)}}>Cancel</Button>
                    <Button variant="outlined" color="success"  autoFocus onClick={()=>{delete_item()}}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}
export default MyAuctionItemObject