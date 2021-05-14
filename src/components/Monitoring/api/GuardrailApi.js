import { ApiManager } from '../utils'
import { BASE_URL } from '../../../constant';

const $http = new ApiManager();

export function postFixGuardrail(data) {
    const url = `${BASE_URL}/fixguardrail`;
    return $http.post(url, data);
}