import React, {useEffect} from "react";
import styles from "../style/AddAuctionPage.module.css";
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
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel, MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import CSS from 'csstype';
import styled from "@emotion/styled";
import {useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import auctionApi from "../api/auctionApi";

interface IUserProps {
    user: User
}
const Input = styled('input')({
    display: 'none',
});

interface Categories {
    categoryId: number
    name: string
}

const AddAuctionPage = () => {
    const navigate=useNavigate();

    const [image, setImage] = React.useState("");
    const [imageUrl, setImageUrl] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [currentUser, setCurrentUser] = React.useState<UserInfo>({email:"", lastName:'', firstName:''});
    const setUserLoggedIn = useUserStore(state => state.setUser)
    let userLoggedIn :UserLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn") as string)
    const [errorEditMessage, setErrorEditMessage] = React.useState("");
    const [selectedEditDescription, setSelectedEditDescription] = React.useState("");
    const [selectedEditTitle, setSelectedEditTitle] = React.useState("");
    const [selectedEditCategory, setSelectedEditCategory] = React.useState("");
    const [selectedEditReserve, setSelectedEditReserve] = React.useState("");
    const [selectedEditDate, setSelectedEditDate] = React.useState("");
    const [allCategories, setAllCategories] = React.useState<Categories[]>([]);

    const userCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "328px",
        width: "300px",
        margin: "10px",
        padding: "0px"
    }


    const setInfo = async (info:any) => {
        await setCurrentUser(info)
    };

    React.useEffect(() => {
        userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn") as string)
        document.title ="Post Auction"

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

    const uploadImage = async () => {

        await userImageApi.uploadUserImage(userLoggedIn.userId,image,userLoggedIn.token)
            .then((response) => {}, (error) => {setErrorMessage(error.toString)})
    };

    const handleCapture = ({ target }: any) => {
        setImageUrl(URL.createObjectURL(target.files[0]));

        setImage(target.files[0]);
    };



    const deleteImagePreview = () => {
        userImageApi.deleteUserImage(userLoggedIn.userId, userLoggedIn.token)
            .then((response) => {
                setImageUrl("");
            }, (error) => {
                setImageUrl("")

            })

    };

    const handleChangeEditCategory = (event: SelectChangeEvent) => {

        setSelectedEditCategory(event.target.value as string);

    };

    const list_of_categories = () => {
        return allCategories.map((item: Categories) =><MenuItem value={item.categoryId}>{item.name}</MenuItem>)
    }

    const checkEditDate = () => {

        const today = new Date()
        const temp = new Date(selectedEditDate);
        console.log(temp<today)
        if(temp < today){
            return true
        }else {
            return false
        }
    };


    const post_auction = () => {
        console.log(selectedEditDate)
        console.log(selectedEditCategory);
        console.log(selectedEditTitle)
        console.log(Number(selectedEditReserve))
        console.log(selectedEditDescription)
        console.log(image)

        setErrorEditMessage("")

        if(selectedEditTitle==="" || selectedEditDescription === ""){
            setErrorEditMessage("Title and description are required")
        } else if (checkEditDate()){
            setErrorEditMessage("End Date Must Be In The Future")
        } else if(Number(selectedEditReserve) < 0){
            setErrorEditMessage("Reserve cannot be negative number")
        } else {
            if(selectedEditReserve === ""){
                setSelectedEditReserve("1")
            }
            const request = {"title":selectedEditTitle,"description":selectedEditDescription, "reserve":Number(selectedEditReserve), "categoryId":selectedEditCategory, "endDate":selectedEditDate}
            auctionApi.postAuction(request,userLoggedIn.token)
                .then((response) => {
                    if(image!=""){
                        auctionApi.changeAuctionImage(response.data.auctionId,image,userLoggedIn.token)
                            .then((response) => {navigate("/myauctions")}, (error) => {setErrorMessage(error.toString)})
                    }else{
                        navigate("/myauctions")
                    }

                }, (error) => {setErrorEditMessage(error.toString)})

        }



    };



    return (
        <div>
            <Navbar/>
            <div className={styles.main_container}>
                <div className={styles.right_side}>
                    <Box
                        component="form"
                        sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}}
                        noValidate
                        autoComplete="off"
                        className={styles.register_box}
                    >
                        <Stack direction="column" alignItems="center" spacing={2} style={{marginTop:30}}>
                            <img src={imageUrl===""?"https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg":imageUrl} alt="" className={styles.preview_image} />
                            <label htmlFor="contained-button-file">
                                <input accept="image/*" id="contained-button-file" multiple type="file" style={{display:"none"}} onChange={handleCapture}/>
                                <Button variant="contained" component="span" color="success">
                                    Upload Image
                                </Button>
                            </label>
                            <Button variant="contained" component="span" color="error" className={styles.button_delete_image} onClick={deleteImagePreview} style={imageUrl===""?{display:'none'}:{display:''}}>
                                Delete Image
                            </Button>
                            <div className={styles.error_box} style={errorEditMessage===""?{display:'none'}:{display:''}} onClick={() => setErrorEditMessage("")}>
                                {errorEditMessage}
                            </div>
                            <TextField
                                id="outlined-error"
                                label="Title"
                                required={true}
                                onChange={(event) => {setSelectedEditTitle(event.target.value)}}
                                style = {{width: 700}}
                            />
                            <TextField
                                id="outlined-error"
                                label="Description"
                                required={true}
                                onChange={(event) => {setSelectedEditDescription(event.target.value)}}
                                style = {{width: 700}}
                            />
                            <FormControl style = {{width: 700}}>
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
                                label="Date and time"
                                style = {{width: 700}}
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
                                style = {{width: 700}}
                                defaultValue={1}
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
                            <Button className={styles.button_signup} onClick={post_auction} >
                                Post Auction
                            </Button>
                        </Stack>
                    </Box>
                </div>
            </div>
        </div>
    )
}
export default AddAuctionPage