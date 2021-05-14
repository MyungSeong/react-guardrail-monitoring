import { ApiManager } from '../../utils'
import { BASE_URL } from '../../../../constant';

const $http = new ApiManager();

export function getCCTVList(data) {
    const url = `${BASE_URL}/cctv`;
    return $http.post(url, data);
}

export function getAccidentInfo() {
    const url = `${BASE_URL}/accidentinfo`;
    return $http.get(url);
}

export function getAccidentList() {
    const url = `${BASE_URL}/accident`;
    return $http.get(url);
}