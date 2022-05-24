import axios from "axios";

const uploadUserImage = async (userId: number, image:any, token:any): Promise<any> => {
    let url = 'http://localhost:4941/api/v1/users/'+userId+'/image'
    return await axios.put(url, image, {headers: {"X-Authorization": token, "Content-Type": image.type}})
}

const deleteUserImage = async (userId: number, token:any): Promise<any> => {
    let url = 'http://localhost:4941/api/v1/users/'+userId+'/image'
    return await axios.delete(url, {headers: {"X-Authorization": token}})
}

export default {uploadUserImage, deleteUserImage}