import axios from "axios";

const URL = "https://fixifyawsamplify-production.up.railway.app"

export async function getAllServices() {
    const response = await axios.get(`${URL}/services`)

    if( response.status == 200 ) {
        return response.data
    } else {
        return // TODO error handling
    }
}

export async function getServicesByType(type) {
    const response = await axios.get(`${URL}/services/${type}`)

    if( response.status == 200 ) {
        return response.data
    } else {
        return // TODO error handling
    }
}
