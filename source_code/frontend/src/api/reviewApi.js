import axios from "axios";

const URL = "fixifyaws-backend-new-production.up.railway.app"

// export async function getReviewsByUserId(id) {
//     const response = await axios.get(`${URL}/reviews/${id}`)

//     if( response.status == 200 ) {
//         return response.data
//     } else {
//         return // TODO error handling
//     }
// }

export async function getTopReviews() {
    const response = await axios.get(`${URL}/reviews/top`)

    if( response.status == 200 ) {
        return response.data
    } else {
        return // TODO error handling
    }
}
