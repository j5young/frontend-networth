import axios from 'axios'

//const USER = 'jchan'
const ASSET_API_URL = 'http://localhost:8080/networth/assets'

class AssetDataService {

    retrieveAllAssets(name) {
        return axios.get(`${ASSET_API_URL}`);
    }

    updateAsset(asset,id) {
        return axios.put(`${ASSET_API_URL}`, asset);
    }

    addAsset(asset) {
        return axios.post(`${ASSET_API_URL}`, asset);
    }

    deleteAsset(id) {
        return axios.delete(`${ASSET_API_URL}/${id}`);
    }
}

export default new AssetDataService()
