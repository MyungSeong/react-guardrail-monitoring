import { ApiManager } from '../utils'
import { BASE_URL } from '../../../constant';

const $http = new ApiManager();

export function getAccidentRoad() {
    const url = `${BASE_URL}/accidentroad`;
    return $http.get(url);
}

export function getRoadData() {
    const url = `${BASE_URL}/getroad`;
    return $http.get(url);
}