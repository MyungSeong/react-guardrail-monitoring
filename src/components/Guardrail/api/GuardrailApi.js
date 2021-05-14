import { ApiManager } from '../../Monitoring/utils'
import { BASE_URL } from '../../../constant';

const $http = new ApiManager();

export function postSetupGuardrail(data) {
    const url = `${BASE_URL}/setupguardrail`;
    return $http.post(url, data);
}