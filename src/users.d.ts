type User = {
    /**
     * User id as defined by the database
     */
    firstName: string,

    lastName:string,
    /**
     * Users username as entered when created
     */
    email: string,

    password:string,

    token:any
}
type UserLoggedIn = {
    userId : number;
    token : any;
}

type UserInfo = {
    firstName : string;
    lastName : string;
    email: string;
}

type UpdateUserRequestWithPass = {
    firstName : string;
    lastName : string;
    email: string;
    password:string;
    currentPassword:string;
}

type UpdateUserRequestWithoutPass = {
    firstName : string;
    lastName : string;
    email: string;

}
