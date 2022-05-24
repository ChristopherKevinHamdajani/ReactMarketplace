import axios from "axios";

const registerUser = async (user: User): Promise<any> => {
    return await axios.post('http://localhost:4941/api/v1/users/register', {"firstName":user.firstName, "lastName":user.lastName, "email":user.email, "password":user.password})
}

const loginUser = async (user: User): Promise<any> => {
    return await axios.post('http://localhost:4941/api/v1/users/login', { "email":user.email, "password":user.password})
}

const logoutUser = async (token: any): Promise<any> => {
    return await axios.post('http://localhost:4941/api/v1/users/logout', {},{headers: {"X-Authorization": token}})
}

const getUserInfo = async (id:number,token: any): Promise<any> => {
    return await axios.get('http://localhost:4941/api/v1/users/'+id, {headers: {"X-Authorization": token}})
}

const getUserImage = async (id:number): Promise<any> => {
    return await axios.get('http://localhost:4941/api/v1/users/'+id+'/image')
}

const updateUser = async (id:number, data:any, token:any): Promise<any> => {
    return await axios.patch('http://localhost:4941/api/v1/users/'+id,data,{headers: {"X-Authorization": token}})
}
export default {registerUser, loginUser, logoutUser, getUserInfo, getUserImage, updateUser}