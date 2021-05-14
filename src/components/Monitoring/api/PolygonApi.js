import { ApiManager } from '../utils'
import { BASE_URL } from '../../../constant';

const $http = new ApiManager();

export function getPolygonData() {
    const url = `${BASE_URL}/polygondata`;
    return $http.get(url);
}