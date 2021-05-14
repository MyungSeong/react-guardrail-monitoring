import { ApiManager } from '../../utils'
import { BASE_URL } from '../../../../constant';

const $http = new ApiManager();

export function postMessage(data) {
    const url = `${BASE_URL}/mqtt`;
    return $http.post(url, data);
}