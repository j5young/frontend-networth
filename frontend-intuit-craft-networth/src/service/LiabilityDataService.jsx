import axios from 'axios'

const LIABILITY_API_URL = 'http://localhost:8080/networth/liabilities'

class LiabilityDataService {

    retrieveAllLiabilities(name) {
        return axios.get(`${LIABILITY_API_URL}`);
    }

    updateLiability(liability) {
        return axios.put(`${LIABILITY_API_URL}`, liability);
    }

    addLiability(liability) {
        const headers = {
            'accept': 'application/json'
        };
        return axios.post(`${LIABILITY_API_URL}`, liability,{headers});
    }

    deleteLiability(id) {
        return axios.delete(`${LIABILITY_API_URL}/${id}`);
    }
}

export default new LiabilityDataService()
