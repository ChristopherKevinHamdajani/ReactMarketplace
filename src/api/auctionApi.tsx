import axios from "axios";

const getAllAuctions = async (): Promise<any> => {
    let url = 'http://localhost:4941/api/v1/auctions'
    return await axios.get(url)
}

const getAllAuctionsWithData = async (url:string): Promise<any> => {
    return await axios.get(url)
}

const getAuctionImage = async (id:number): Promise<any> => {
    let url = 'http://localhost:4941/api/v1/auctions/'+id+"/image"
    return await axios.get(url)
}

const getAllCategories = async (): Promise<any> => {
    let url = 'http://localhost:4941/api/v1/auctions/categories'
    return await axios.get(url)
}

const getSingleAuction = async (id:number): Promise<any> => {
    let url = 'http://localhost:4941/api/v1/auctions/'+id;
    return await axios.get(url)
}

const getBidders = async (id:number): Promise<any> => {
    let url = 'http://localhost:4941/api/v1/auctions/'+id+"/bids";
    return await axios.get(url)
}

const postBid = async (id: number,data:any, token:any): Promise<any> => {
    let url = 'http://localhost:4941/api/v1/auctions/'+id+"/bids";
    return await axios.post(url,data, {headers: {"X-Authorization": token}})
}

export default {getAllAuctions, getAuctionImage,getAllCategories, getSingleAuction, getBidders, getAllAuctionsWithData,postBid}