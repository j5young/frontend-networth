import axios from 'axios'

const NETWORTH_API_URL = 'http://localhost:8080/networth'

class NetWorthDataService {

    retrieveNetWorth(name) {
        return axios.get(`${NETWORTH_API_URL}`);
    }
}

export default new NetWorthDataService()
