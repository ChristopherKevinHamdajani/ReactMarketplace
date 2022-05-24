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

const EditProfilePage = () => {
    const navigate=useNavigate();
    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [newPassword, setNewPassword] = React.useState("")
    const [currentPassword, setCurrentPassword] = React.useState("")
    const [showNewPassword, setShowNewPassword] = React.useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
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
        document.title ="Edit My Profile"

        if(userLoggedIn === null){
            navigate("/")
        } else {
            const getUsers = () => {
                userApi.getUserInfo(userLoggedIn.userId, userLoggedIn.token)
                    .then((response) => {
                        setInfo(response.data).then(r => {});
                        setFirstName(response.data.firstName);
                        setLastName(response.data.lastName);
                        setEmail(response.data.email)
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

    const uploadImage = async () => {

        await userImageApi.uploadUserImage(userLoggedIn.userId,image,userLoggedIn.token)
            .then((response) => {}, (error) => {setErrorMessage(error.toString)})
    };

    const handleCapture = ({ target }: any) => {
        setImageUrl(URL.createObjectURL(target.files[0]));

        setImage(target.files[0]);
    };

    const updateProfile = () => {
        if(image!=""){
            userImageApi.uploadUserImage(userLoggedIn.userId,image,userLoggedIn.token)
                .then((response) => {}, (error) => {setErrorMessage(error.toString)})
        }
        setErrorMessage("")
        setEmailError(false)
        setFirstNameError(false)
        setLastNameError(false)
        setPasswordError(false)
        if(email===""||firstName===""||lastName===""){
            setErrorMessage("You cannot leave email, first name, last name empty!");
            setEmailError(true)
            setFirstNameError(true);
            setLastNameError(true);
        } else if (!emailValidation()){
            setErrorMessage("Email should contain '@' and top level domain!")
            setEmailError(true)
        } else {
            if (newPassword != ""|| currentPassword !=""){
                if(newPassword.length < 6){
                    setErrorMessage("Password need to be at least 6 characters!")
                    setPasswordError(true)
                }else {
                    let updateRequest:UpdateUserRequestWithPass = {"firstName":firstName, "lastName":lastName, "email":email, "password":newPassword, "currentPassword":currentPassword}
                    userApi.updateUser(userLoggedIn.userId,updateRequest,userLoggedIn.token)
                        .then((response) => {navigate("/updateusersuccess")}, (error) => {if(error.response.status === 400){
                            setErrorMessage("Invalid password(s)")
                            setNewPassword("")
                            setCurrentPassword("")
                        }})
                }
            } else {
                let updateRequest:UpdateUserRequestWithoutPass = {"firstName":firstName, "lastName":lastName, "email":email}
                userApi.updateUser(userLoggedIn.userId,updateRequest,userLoggedIn.token)
                    .then((response) => {navigate("/updateusersuccess")}, (error) => {setErrorMessage(error.toString);})
            }

        }
    };

    const deleteImagePreview = () => {
        userImageApi.deleteUserImage(userLoggedIn.userId, userLoggedIn.token)
            .then((response) => {
                setImageUrl("");
            }, (error) => {
                setImageUrl("")

            })

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
                        <Stack direction="column" alignItems="center" spacing={2}>
                            <p className={styles.register_title}>Edit My Profile</p>
                            <img src={imageUrl===""?defaultPicture:imageUrl} alt="" className={styles.preview_image}/>
                            <label htmlFor="contained-button-file">
                                <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={handleCapture}/>
                                <Button variant="contained" component="span" color="success">
                                    Upload Image
                                </Button>
                            </label>
                            <Button variant="contained" component="span" color="error" className={styles.button_delete_image} onClick={deleteImagePreview} style={imageUrl===""?{display:'none'}:{display:''}}>
                                Delete Image
                            </Button>
                            <div className={styles.error_box} style={errorMessage===""?{display:'none'}:{display:''}} onClick={() => setErrorMessage("")}>
                                {errorMessage}
                            </div>
                            <TextField
                                id="outlined-error"
                                label="First Name"
                                defaultValue={""}
                                className = {styles.text_field_input}
                                error={firstNameError}
                                value={firstName}
                                onChange={(event) => {setFirstName(event.target.value)}}
                            />
                            <TextField
                                id="outlined-error"
                                label="Last Name"
                                className = {styles.text_field_input}
                                error={lastNameError}
                                defaultValue=""
                                value={lastName}
                                onChange={(event) => {setLastName(event.target.value)}}
                            />
                            <TextField
                                id="outlined-error"
                                label="Email"
                                className = {styles.text_field_input}
                                defaultValue=""
                                value={email}
                                error={emailError}
                                onChange={(event) => {setEmail(event.target.value)}}
                            />
                            <TextField
                                id="outlined-error"
                                label="Current Password"
                                type={showCurrentPassword?"text":"password"}
                                className = {styles.text_field_input}
                                onChange={(event) => {setCurrentPassword(event.target.value)}}
                                error={passwordError}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <VisibilityIcon className={styles.visibility_icon} style={showCurrentPassword?{display:'none'}:{display:''}} onClick={() => {setShowCurrentPassword(true)}}/>
                                            <VisibilityOffIcon className={styles.visibility_icon} style={showCurrentPassword?{display:''}:{display:'none'}} onClick={() => {setShowCurrentPassword(false)}}/>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <TextField
                                id="outlined-error"
                                label="New Password"
                                type={showNewPassword?"text":"password"}
                                className = {styles.text_field_input}
                                onChange={(event) => {setNewPassword(event.target.value)}}
                                error={passwordError}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <VisibilityIcon className={styles.visibility_icon} style={showNewPassword?{display:'none'}:{display:''}} onClick={() => {setShowNewPassword(true)}}/>
                                            <VisibilityOffIcon className={styles.visibility_icon} style={showNewPassword?{display:''}:{display:'none'}} onClick={() => {setShowNewPassword(false)}}/>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Button className={styles.button_edit} onClick={() => {updateProfile()}}>
                                Update profile
                            </Button>

                        </Stack>
                    </Box>
                </div>
            </div>
        </div>
    )
}
export default EditProfilePage