import React, {useEffect} from "react";
import styles from "../style/Register.module.css";
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

const RegisterPage = () => {
    useEffect(() => {
        document.title = "Register"

    }, [])
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
    const setUserLoggedIn = useUserStore(state => state.setUser)

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

    const registerUser = () => {
        setErrorMessage("")
        setEmailError(false)
        setFirstNameError(false)
        setLastNameError(false)
        setPasswordError(false)
        if(email===""||password===""||firstName===""||lastName===""){
            setErrorMessage("You need to fill all the fields!")
        } else if (!emailValidation()){
            setErrorMessage("Email should contain '@' and top level domain!")
            setEmailError(true)
        } else if(password.length < 6){
            setErrorMessage("Password need to be at least 6 characters!")
            setPasswordError(true)
        } else{
            const newUser = {"firstName":firstName, "lastName":lastName, "email":email, "password":password, token:''}
            userApi.registerUser(newUser)
                .then((response) => {
                    if(response.status === 201){

                        setErrorMessage("")

                        userApi.loginUser(newUser)
                            .then((response) => {
                                if(response.status === 200){
                                    setErrorMessage("")
                                    const userId = response.data.userId
                                    const token = response.data.token
                                    const userLoggedIn: UserLoggedIn = {"userId": userId, "token":token}
                                    setUserLoggedIn(userLoggedIn);

                                    if(image !== ""){
                                        userImageApi.uploadUserImage(userId,image,token)
                                            .then((response) => {navigate("/")}, (error) => {setErrorMessage(error.toString)})
                                    } else {
                                        navigate("/")
                                    }

                                }
                            }, (error) => {
                                setErrorMessage(error.toString())
                            })
                    }
                }, (error) => {

                    if(error.response.status === 403){
                        setErrorMessage("Email is already taken")
                        setEmailError(true)
                    } else {
                        setErrorMessage(error.toString())
                    }

                })
        }
    };

    const handleCapture = ({ target }: any) => {
        setImageUrl(URL.createObjectURL(target.files[0]));

        setImage(target.files[0]);
    };

    const deleteImagePreview = () => {
        setImage("");
    };


    return (
        <div>
            <Navbar/>
            <div className={styles.main_container}>

                <div className={styles.left_side}>
                    <div className={styles.information_left}>
                        <p className={styles.information_left_title}>
                            Welcome Back!
                        </p>
                        <p className={styles.information_left_text}>
                            To start an auction or bid on something please log in with your personal information!
                        </p>
                        <Button className={styles.button_login} onClick={() => navigate("/login")}>
                            Login
                        </Button>
                    </div>
                </div>


                <div className={styles.right_side}>
                    <Box
                        component="form"
                        sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}}
                        noValidate
                        autoComplete="off"
                        className={styles.register_box}
                    >
                        <Stack direction="column" alignItems="center" spacing={2}>
                            <p className={styles.register_title}>Create New Account</p>
                            <img src={image===""?defaultPicture:imageUrl} alt="" className={styles.preview_image}/>
                            <label htmlFor="contained-button-file">
                                <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={handleCapture}/>
                                <Button variant="contained" component="span" className={styles.button_upload_image}>
                                    Upload Image
                                </Button>
                            </label>
                            <Button variant="contained" component="span" className={styles.button_delete_image} onClick={deleteImagePreview} style={image===""?{display:'none'}:{}}>
                                Delete Image
                            </Button>
                            <div className={styles.error_box} style={errorMessage===""?{display:'none'}:{display:''}} onClick={() => setErrorMessage("")}>
                                {errorMessage}
                            </div>
                            <TextField
                                id="outlined-error"
                                label="First Name"
                                className = {styles.text_field_input}
                                error={firstNameError}
                                onChange={(event) => {setFirstName(event.target.value)}}
                            />
                            <TextField
                                id="outlined-error"
                                label="Last Name"
                                className = {styles.text_field_input}
                                error={lastNameError}
                                onChange={(event) => {setLastName(event.target.value)}}
                            />
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
                            <Button className={styles.button_signup} onClick={() => registerUser()}>
                                Sign Up
                            </Button>
                        </Stack>
                    </Box>
                </div>
            </div>
        </div>
    )
}
export default RegisterPage