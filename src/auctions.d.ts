type AuctionsItem = {
    auctionId : number;
    title : string;
    description: string;
    endDate: any;
    reserve:number;
    sellerId:number;
    sellerFirstName:string,
    sellerLastName:string,
    categoryId:number;
    highestBid:number;
    numBids:number
}

type Bidder = {
    bidderId: number;
    firstName : string;
    lastName : string;
    timestamp : string;
    amount:number;
}

type postBid = {
    bidderId: number,
    amount: number
}