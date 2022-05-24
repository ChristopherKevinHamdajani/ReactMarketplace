import {AppBar, Box, Button, IconButton, Toolbar, Typography} from "@mui/material";
import {useUserStore} from "../store";
import userApi from "../api/userApi";
import React from "react";
import {useNavigate} from "react-router-dom";
const Navbar = () => {
    const navigate=useNavigate();
    let userLoggedIn :UserLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn") as string)
    // const removeUserLoggedIn = useUserStore(state => state.removeUser)
    const [errorMessage, setErrorMessage] = React.useState("");
    React.useEffect(() => {
        userLoggedIn =JSON.parse(localStorage.getItem("userLoggedIn") as string)
    }, [])


    const logOutUser = () => {
        userApi.logoutUser(userLoggedIn.token)
            .then((response) => {
                if(response.status === 200){

                        // removeUserLoggedIn()
                        localStorage.clear()
                        setErrorMessage("")
                        navigate("/")

                    }
                }, (error) => {
                    if(error.response.status === 401){
                        setErrorMessage("You must log in first!")
                    } else {
                        setErrorMessage(error.toString())
                    }
            })


    };

    const navigateTo = (path:string) => {
        navigate(path);
    };



    return (<Box sx={{  }} >
        <AppBar position="static" style = {{backgroundColor:'#FB6107'}}>
            <Toolbar>
                <div className="navbar">
                    <div className="navbar-button-container">
                        <Button color="inherit" onClick={() => navigateTo("/auction")}>Auctions</Button>
                    </div>

                    <div className="navbar-button-container" style={userLoggedIn===null || (userLoggedIn.token===""&& userLoggedIn.userId===-1)?{display:''}:{display:'none'}} >
                        <Button color="inherit" onClick={() => navigateTo("/login")}>Login</Button>
                        <Button color="inherit" onClick={() => navigateTo("/register")}>Signup</Button>
                    </div>
                    <div className="navbar-button-container" style={userLoggedIn===null || (userLoggedIn.token===""&& userLoggedIn.userId===-1)?{display:'none'}:{display:''}} >
                        <Button color="inherit" onClick={() => navigateTo("/userprofile")}>Profile</Button>
                        <Button color="inherit"  onClick={() => logOutUser()}>Logout</Button>
                    </div>

                </div>

            </Toolbar>
        </AppBar>
        <div className="navbar-error-box" style={errorMessage===""?{display:'none'}:{display:''}} onClick={() => setErrorMessage("")}>
            {errorMessage}
        </div>
    </Box>)
}
export default Navbar;