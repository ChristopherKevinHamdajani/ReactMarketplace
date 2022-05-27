import axios from 'axios';
import React from "react";
import CSS from 'csstype';
import {Paper, AlertTitle, Alert, alpha, styled, TextField, InputAdornment, Autocomplete} from "@mui/material";
import AuctionItemObject from "../components/AuctionItemObject";
import {useUserStore} from "../store";
import auctionApi from '../api/auctionApi';
import Navbar from "../components/Navbar";
import {Search} from "@mui/icons-material";
import styles from "../style/AuctionPage.module.css";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SearchIcon from '@mui/icons-material/Search';

interface Categories {
    categoryId: number
    name: string
}
const AuctionPage = () => {
    const [items, setItems] = React.useState<Array<AuctionsItem>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [allCategories, setAllCategories] = React.useState<Categories[]>([]);

    const [searchParam, setSearchParam] = React.useState("")

    const getItems = () => {
        auctionApi.getAllAuctions()
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setItems(response.data.auctions)

            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString() )
            })
    }


    React.useEffect(() => {
        getItems()
    }, [setItems])
    const user_rows = () => items.map((item: AuctionsItem) =>
        <AuctionItemObject key={item.auctionId + item.title} item={item} id={item.auctionId}/>)
    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        width: "fit-content"
    }
    return (
        <div className="main-container">
            <Navbar/>
            <div className={styles.top_bar}>
                <TextField
                    style={{width:"500px"}}
                    label="Search" id="fullWidth"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon/>
                            </InputAdornment>
                        )
                    }}
                />

                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={allCategories}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    style = {{width: 700}}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Filter by Categories"
                            placeholder="Favorites"
                        />
                    )}
                />

                <div>Hllo</div>
            </div>
            <h1>Bid Like You Never Bid Before!</h1>
            <div style={{display:"inline-block", maxWidth:"95%", minWidth:"320"}}>
                {errorFlag? <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                    :""}
                {user_rows()}
            </div>
        </div>
    )
}
export default AuctionPage;