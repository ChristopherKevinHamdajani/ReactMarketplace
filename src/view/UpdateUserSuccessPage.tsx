import React, {useEffect} from "react";
import styles from "../style/Profile.module.css";
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
    Box, Button, Card, CardActions, CardContent, CardMedia, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, InputAdornment, Stack, TextField, Typography
} from "@mui/material";
import CSS from 'csstype';
import styled from "@emotion/styled";
import {useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";

interface IUserProps {
    user: User
}
const Input = styled('input')({
    display: 'none',
});

const UpdateUserSuccess = () => {
    const navigate=useNavigate();
    let userLoggedIn :UserLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn") as string)

    const userCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "328px",
        width: "300px",
        margin: "10px",
        padding: "0px"
    }



    React.useEffect(() => {
        userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn") as string)
        document.title ="Edit My Profile Successful"
    }, [])


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
                        <Stack direction="column" alignItems="center" spacing={2}>
                            <h1 style={{color:"green",fontWeight:"bold"}}>Your User Information is Successfully Updated!</h1>
                            <Button className={styles.button_edit} onClick={() => {navigate("/")}}>
                                Go to Auction
                            </Button>
                            <Button className={styles.button_edit} onClick={() => {navigate("/userprofile")}}>
                                Go to My Profile
                            </Button>
                        </Stack>
                    </Box>
                </div>
            </div>
        </div>
    )
}
export default UpdateUserSuccess