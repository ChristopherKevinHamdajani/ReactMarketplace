import React from "react";
import axios from "axios";
import {Delete, Edit} from "@mui/icons-material";
import {useUserStore} from "../store";
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl, InputAdornment,
    InputLabel, MenuItem, Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import CSS from 'csstype';
import auctionApi from "../api/auctionApi";
import defaultPicture from "../assets/blank-profile-picture.png";

import styles from "../style/MyAuctionItemObject.module.css";

import {useNavigate} from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import userImageApi from "../api/userImageApi";


interface AuctionItemProps {
    item: AuctionsItem
    id: number
}

interface Categories {
    categoryId: number
    name: string
}
const MyAuctionItemObject = (props: AuctionItemProps) => {
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


    const [item] = React.useState<AuctionsItem>(props.item)
    const [openEditDialog, setOpenEditDialog] = React.useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [allCategories, setAllCategories] = React.useState<Categories[]>([]);
    const [itemCategory, setItemCategory] = React.useState("");
    const [remainingDays, setRemainingDays] = React.useState(-1)
    const [selectedItem, setSelectedItem] = React.useState(-1)
    const [errorMessage, setErrorMessage] = React.useState("");
    const [errorEditMessage, setErrorEditMessage] = React.useState("");
    let userLoggedIn :UserLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn") as string)
    const [imageUrl, setImageUrl] = React.useState("");
    const [image, setImage] = React.useState("");
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
    const [selectedEditCategory, setSelectedEditCategory] = React.useState(item.categoryId.toString(10));
    const [selectedEditDate, setSelectedEditDate] = React.useState("2023-06-03T22:06");
    const [selectedEditTitle, setSelectedEditTitle] = React.useState(item.title);
    const [selectedEditDescription, setSelectedEditDescription] = React.useState(selectedItemFull.description);
    const [selectedEditReserve, setSelectedEditReserve] = React.useState(item.reserve.toString(10));

    const handleChangeEditCategory = (event: SelectChangeEvent) => {

        setSelectedEditCategory(event.target.value as string);

    };


    const handleCapture = ({ target }: any) => {
        setImageUrl(URL.createObjectURL(target.files[0]));
        setImage(target.files[0]);
    };

    const close_edit_dialog = () => {
        setOpenEditDialog(false);
        setSelectedItem(-1);
        setSelectedItemFull(defaultItem);
        trim_selected_item_end_date();
        setSelectedEditCategory(item.categoryId.toString(10))
        setSelectedEditReserve("")
        setSelectedEditDescription("")
        setSelectedEditTitle("")
        setErrorEditMessage("")
    };


    const calculateRemainingDays = (closingDate : any) => {
        const now = new Date()
        const end_date = new Date(closingDate)
        const utc_end = Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate());
        const utc_now = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        const remaining_days = Math.floor((utc_end - utc_now) / _MS_PER_DAY)
        setRemainingDays(remaining_days);
    }



    const trim_selected_item_end_date = () => {
        const trimmed_end_date = item.endDate.slice(0,16);
        setSelectedEditDate(trimmed_end_date)
    };




    const list_of_categories = () => {
        return allCategories.map((item: Categories) =><MenuItem value={item.categoryId}>{item.name}</MenuItem>)
    }


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

    const checkEditDate = () => {

        const today = new Date()
        const temp = new Date(selectedEditDate);

        if(temp < today){
            return true
        }else {
            return false
        }
    };

    const update_auction = () => {
        if(image!=""){
            auctionApi.changeAuctionImage(item.auctionId,image,userLoggedIn.token)
                .then((response) => {}, (error) => {setErrorMessage(error.toString)})
        }
        setErrorEditMessage("")

        if(selectedEditTitle==="" || selectedEditDescription === ""){
            setErrorEditMessage("Title and description are required")
        } else if (checkEditDate()){
            setErrorEditMessage("End Date Must Be In The Future")
        } else {
            if(selectedEditReserve ===""){
                setSelectedEditReserve("1")
            }
            const request = {"title":selectedEditTitle,"description":selectedEditDescription, "reserve":Number(selectedEditReserve), "categoryId":selectedEditCategory, "endDate":selectedEditDate}
            auctionApi.updateAuction(item.auctionId,request,userLoggedIn.token)
                .then((response) => {window.location.reload()}, (error) => {setErrorEditMessage(error.toString)})

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
                setSelectedEditDescription(response.data.description)
                setSelectedEditTitle(response.data.title)
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

    return (
        <Card sx={userCardStyles} className={styles.container_item} >
            <div style={errorMessage===""?{display:'none'}:{display:''}} onClick={() => setErrorMessage("")}>
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

                <div className={styles.footer_card_up}>
                    <div className={styles.footer_left}>
                        <Avatar src={"http://localhost:4941/api/v1/users/"+item.sellerId+"/image"} />
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


                    <div className={styles.footer_card_down}>
                        <div style={item.numBids !== 0?{display:'none'}:{display:''}}>
                            <Button variant="contained" color="success" onClick={ () => {
                                trim_selected_item_end_date()
                                get_selected_item()
                            }}>
                                Edit
                            </Button>
                        </div>
                        <div style={item.numBids !== 0?{display:'none'}:{display:''}}>
                            <Button variant="contained" color="error" onClick={() => {
                                setSelectedItem(item.auctionId);
                                setOpenDeleteDialog(true)
                            }}>
                                Delete
                            </Button>
                        </div>


                        <div>
                            <Button variant="contained" onClick={()=>{navigate("/auctionitem/"+item.auctionId)}}>
                                See Details
                            </Button>
                        </div>

                    </div>


                <Chip label={getCategoryItem()} color="success" className={styles.category_chip} />

            </CardContent>
            <CardActions>

            </CardActions>

            {/*delete dialog*/}
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


            {/*edit dialog*/}
            <Dialog
                fullWidth={true}
                maxWidth={'xl'}
                open={openEditDialog}
                onClose={close_edit_dialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Edit Your Item"}
                </DialogTitle>
                <DialogContent style={{padding:"15px"}}>
                    <Stack direction="column" alignItems="center" spacing={2}>
                        <img src={imageUrl===""?"https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg":imageUrl} alt="" className={styles.preview_image}/>
                        <label htmlFor="contained-button-file">
                            <input accept="image/*" id="contained-button-file" multiple type="file" style={{display:"none"}} onChange={handleCapture}/>
                            <Button variant="contained" component="span" color="success">
                                Upload Image
                            </Button>
                        </label>
                        <div className={styles.error_box} style={errorEditMessage===""?{display:'none'}:{display:''}} onClick={() => setErrorEditMessage("")}>
                            {errorEditMessage}
                        </div>
                        <TextField
                            id="outlined-error"
                            label="Title"
                            defaultValue={selectedItemFull.title}
                            fullWidth={true}
                            required={true}
                            onChange={(event) => {setSelectedEditTitle(event.target.value)}}
                        />
                        <TextField
                            id="outlined-error"
                            label="Description"
                            defaultValue={selectedItemFull.description}
                            fullWidth={true}
                            required={true}
                            onChange={(event) => {setSelectedEditDescription(event.target.value)}}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedEditCategory}
                                label="Category"
                                inputProps={{ 'aria-label': 'Without label' }}
                                onChange={handleChangeEditCategory}
                            >
                                {list_of_categories()}
                            </Select>
                        </FormControl>
                        <TextField
                            id="outlined-error"
                            label="End Date and time"
                            defaultValue={selectedEditDate}
                            fullWidth={true}
                            type={"datetime-local"}
                            onChange={(event) => {setSelectedEditDate(event.target.value)}}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            id="outlined-number"
                            label="Reserve"
                            type="number"
                            fullWidth
                            defaultValue={item.reserve}
                            onChange={(event) => {setSelectedEditReserve(event.target.value)}}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachMoneyIcon/>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close_edit_dialog}>Cancel</Button>
                    <Button variant="outlined" color="success"  autoFocus onClick={update_auction}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}
export default MyAuctionItemObject