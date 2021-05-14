import { ApiManager } from '../utils'
import { BASE_URL } from '../../../constant';

const $http = new ApiManager();

export default {
   getCCTVList: (data) => {
       const url = `${BASE_URL}/cctv`;
       return $http.post(url, data);
   }
}