import axios from "axios";

const URL = "https://fixifyaws-backend-new-production.up.railway.app"

export async function verifyUser(user) {
    const response = await axios.post(`${URL}/users/login`, user)
    return response.data
}

export async function fetchAllUsers() {
    const response = await axios.get(`${URL}/users`)
    if (response.status == 200) {
        return response
    } else {
        return
    }
}
