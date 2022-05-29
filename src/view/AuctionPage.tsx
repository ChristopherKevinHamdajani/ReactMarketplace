import axios from 'axios';
import React from "react";
import CSS from 'csstype';
import {
    Paper,
    AlertTitle,
    Alert,
    alpha,
    styled,
    TextField,
    InputAdornment,
    Autocomplete,
    InputLabel, Select, FormControl, SelectChangeEvent, MenuItem, PaginationItem, Pagination, Stack, Button
} from "@mui/material";
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
    // const [itemsTemp, setItemsTemp] = React.useState<Array<AuctionsItem>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [allCategories, setAllCategories] = React.useState<Categories[]>([]);

    const [searchParam, setSearchParam] = React.useState("")
    const [categoryParam, setCategoryParam] = React.useState<Array<Categories>>([])
    const [sortingParam, setSortingParam] = React.useState("CLOSING_SOON");
    const [statusParam, setStatusParam] = React.useState("OPEN");
    const [numPage, setNumPage] = React.useState(1);//current page
    const [totalItem, setTotalItem] = React.useState(0);



    const getItems = () => {
        let url = 'http://localhost:4941/api/v1/auctions?q='+searchParam+"&count=10&startIndex=0";


        for(let i=0; i< categoryParam.length; i++){
            url += "&categoryIds="+categoryParam[i].categoryId;
        }

        if(sortingParam !== ""){
            url += "&sortBy="+sortingParam
        }

        url += "&status="+statusParam


        const getPaginatedItems = () => {

            auctionApi.getAllAuctionsWithData(url)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setItems(response.data.auctions)
                    setTotalItem(response.data.count)

                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString() )
                })

        };

        getPaginatedItems()
        setNumPage(1)
    }

    const getItemsWithPagination = () => {

        let url = 'http://localhost:4941/api/v1/auctions?q='+searchParam+"&count=10";

        for(let i=0; i< categoryParam.length; i++){
            url += "&categoryIds="+categoryParam[i].categoryId;
        }

        if(sortingParam !== ""){
            url += "&sortBy="+sortingParam
        }

        if(sortingParam !== ""){
            url += "&status="+statusParam
        }

        const temp = numPage - 1;
        const startInd = temp * 10;
        url += "&startIndex="+startInd

        const getPaginatedItems = () => {

            auctionApi.getAllAuctionsWithData(url)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setItems(response.data.auctions)
                    setTotalItem(response.data.count)


                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString() )
                })

        };

        getPaginatedItems()

    }
    const getAllCategories = () => {
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

    const handleChangeSortingParam = (event: SelectChangeEvent) => {

        setSortingParam(event.target.value as string);

    };

    const handleChangeStatusParam = (event: SelectChangeEvent) => {
        setStatusParam(event.target.value as string);

    };


    const handleChangePage = (
        ev:any,
        value: any
    ) => {
        setNumPage(value)
    };


    React.useEffect(() => {
        getItems()
    }, [searchParam, categoryParam, sortingParam,statusParam])
    React.useEffect(() => {
        getItemsWithPagination()
    }, [numPage])
    React.useEffect(() => {
        getAllCategories()
    }, [])


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
                    onChange={(event) => {setSearchParam(event.target.value)}}
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
                    onChange={(event, value) => setCategoryParam(value)}
                    isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Filter by Categories"
                            placeholder="Favorites"
                        />
                    )}
                />
                <FormControl style={{width:500}}>
                    <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sortingParam}
                        label="SortBy"
                        inputProps={{ 'aria-label': 'Without label' }}
                        onChange={handleChangeSortingParam}
                    >
                        <MenuItem value={"ALPHABETICAL_ASC"}>Ascending alphabetically</MenuItem>
                        <MenuItem value={"ALPHABETICAL_DESC"}>Descending alphabetically</MenuItem>
                        <MenuItem value={"BIDS_ASC"}>Ascending by current bid</MenuItem>
                        <MenuItem value={"BIDS_DESC"}>Descending by current bid</MenuItem>
                        <MenuItem value={"CLOSING_SOON"}>Closing Soon</MenuItem>
                        <MenuItem value={"CLOSING_LAST"}>Closing Last</MenuItem>
                        <MenuItem value={"RESERVE_ASC"}>Ascending by reserve price</MenuItem>
                        <MenuItem value={"RESERVE_DESC"}>Descending by reserve price</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{width:500}}>
                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={statusParam}
                        label="Status"
                        inputProps={{ 'aria-label': 'Without label' }}
                        onChange={handleChangeStatusParam}
                    >
                        <MenuItem value={"ANY"}>Any</MenuItem>
                        <MenuItem value={"OPEN"}>Open</MenuItem>
                        <MenuItem value={"CLOSED"}>Close</MenuItem>
                    </Select>
                </FormControl>
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
            <div style={{display:"flex",justifyContent:"center",marginBottom:100}}>
                <Pagination count={Math.ceil(totalItem/10)} page={numPage} size="large" onChange={handleChangePage} shape="rounded" />
            </div>

        </div>
    )
}
export default AuctionPage;