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

const ProfilePage = () => {
    const navigate=useNavigate();
    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [image, setImage] = React.useState("");
    const [imageUrl, setImageUrl] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [firstNameError, setFirstNameError] = React.useState(false);
    const [lastNameError, setLastNameError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState<UserInfo>({email:"", lastName:'', firstName:''});
    const setUserLoggedIn = useUserStore(state => state.setUser)
    let userLoggedIn :UserLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn") as string)
    const newUser = {"firstName":firstName, "lastName":lastName, "email":"", "password":"", "token":''}

    const userCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "328px",
        width: "300px",
        margin: "10px",
        padding: "0px"
    }

    const emailValidation = () => {
        const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,25}(.[a-z{1,25}])?/g;
        if (regEx.test(email)) {
            return true
        } else {
            return false
        }
    };

    const setInfo = async (info:any) => {
        await setCurrentUser(info)
    };

    React.useEffect(() => {
        userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn") as string)
        document.title ="My Profile"

        if(userLoggedIn === null){
            navigate("/")
        } else {
            const getUsers = () => {
                userApi.getUserInfo(userLoggedIn.userId, userLoggedIn.token)
                    .then((response) => {
                        setInfo(response.data).then(r => {});

                        userApi.getUserImage(userLoggedIn.userId)
                            .then((response) => {
                                const url = "http://localhost:4941/api/v1/users/"+userLoggedIn.userId+"/image"
                                setImageUrl(url)
                            }, (error) => {
                                setImageUrl("")

                            })
                    }, (error) => {
                        setErrorMessage(error.toString() )
                    })
            }
            getUsers()
        }

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
                            <p className={styles.register_title}>My Profile</p>
                            <img src={imageUrl===""?defaultPicture:imageUrl} alt="" className={styles.preview_image}/>

                            <div className={styles.error_box} style={errorMessage===""?{display:'none'}:{display:''}} onClick={() => setErrorMessage("")}>
                                {errorMessage}
                            </div>
                            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between", width:"50%"}}>
                                <Typography variant="h4" className={styles.text_info}>
                                    First name:
                                </Typography>
                                <Typography variant="h4" className={styles.text_info}>
                                    {currentUser.firstName}
                                </Typography>
                            </div>
                            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between", width:"50%"}}>
                                <Typography variant="h4" className={styles.text_info}>
                                    Last name:
                                </Typography>
                                <Typography variant="h4" className={styles.text_info}>
                                    {currentUser.lastName}
                                </Typography>
                            </div>
                            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between", width:"50%"}}>
                                <Typography variant="h4" className={styles.text_info}>
                                    Email:
                                </Typography>
                                <Typography variant="h4" className={styles.text_info}>
                                    {currentUser.email}
                                </Typography>
                            </div>
                            <Button className={styles.button_edit} onClick={() => {navigate("/editprofile")}}>
                                Edit Your account
                            </Button>
                        </Stack>
                    </Box>
                </div>
            </div>
        </div>
    )
}
export default ProfilePage