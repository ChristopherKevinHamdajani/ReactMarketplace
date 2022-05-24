import React, {useEffect} from "react";
import styles from "../style/Login.module.css";
import axios from "axios";
import {Delete, Edit} from "@mui/icons-material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import defaultPicture from '../assets/blank-profile-picture.png'
import userApi from '../api/userApi';
import {useUserStore} from "../store";
// import {useUserStore} from "../store";
import {
    Box, Button, Card, CardActions, CardContent, CardMedia, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, InputAdornment, Stack, TextField, Typography
} from "@mui/material";
import CSS from 'csstype';
import styled from "@emotion/styled";
import userImageApi from "../api/userImageApi";
import {useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";
interface IUserProps {
    user: User
}
const Input = styled('input')({
    display: 'none',
});

const LoginPage = () => {
    useEffect(() => {
        document.title = "Login"

    }, [])

    const navigate=useNavigate();
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("");
    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const setUserLoggedIn = useUserStore(state => state.setUser)

    const userCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "328px",
        width: "300px",
        margin: "10px",
        padding: "0px"
    }

    const logInUser = () => {
        if(email===""||password===""){
            setErrorMessage("You need to fill all the fields!")
        } else {
            const newUser = {"firstName":'', "lastName":'', "email":email, "password":password, token:''}
            userApi.loginUser(newUser)
                .then((response) => {
                    if(response.status === 200){

                        setErrorMessage("")
                        const userId = response.data.userId
                        const token = response.data.token
                        const userLoggedIn: UserLoggedIn = {"userId": userId, "token":token}
                        setUserLoggedIn(userLoggedIn);
                        navigate("/")
                    }
                }, (error) => {
                    if(error.response.status === 400){
                        setErrorMessage("Invalid Email/Password")
                        setEmailError(true)
                        setPasswordError(true)
                    } else {
                        setErrorMessage(error.toString())
                    }
                })
        }

    };

    return (
        <div>
            <Navbar/>
            <div className={styles.main_container}>

                <div className={styles.left_side}>
                    <Box
                        component="form"
                        sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}}
                        noValidate
                        autoComplete="off"
                        className={styles.register_box}
                    >
                        <Stack direction="column" alignItems="center" spacing={2}>
                            <p className={styles.register_title}>Welcome Back</p>

                            <div className={styles.error_box} style={errorMessage===""?{display:'none'}:{display:''}} onClick={() => setErrorMessage("")}>
                                {errorMessage}
                            </div>
                            <TextField
                                id="outlined-error"
                                label="Email"
                                className = {styles.text_field_input}
                                error={emailError}
                                onChange={(event) => {setEmail(event.target.value)}}
                            />
                            <TextField
                                id="outlined-error"
                                label="Password"
                                type={showPassword?"text":"password"}
                                className = {styles.text_field_input}
                                onChange={(event) => {setPassword(event.target.value)}}
                                error={passwordError}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <VisibilityIcon className={styles.visibility_icon} style={showPassword?{display:'none'}:{display:''}} onClick={() => {setShowPassword(true)}}/>
                                            <VisibilityOffIcon className={styles.visibility_icon} style={showPassword?{display:''}:{display:'none'}} onClick={() => {setShowPassword(false)}}/>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Button className={styles.button_signup} onClick={() => logInUser()} >
                                Log In
                            </Button>
                        </Stack>
                    </Box>
                </div>

                <div className={styles.right_side}>
                    <div className={styles.information_left}>
                        <p className={styles.information_left_title}>
                            Join Us!
                        </p>
                        <p className={styles.information_left_text}>
                            Enter your personal information to join with us!
                        </p>
                        <Button className={styles.button_login} onClick={() => navigate("/register")}>
                            Sign Up
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default LoginPage