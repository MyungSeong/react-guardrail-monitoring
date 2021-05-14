import {CCTVApi} from "../../../api";

export const GET_CCTV_LIST = 'cctv/GET_CCTV_LIST';

/**
 * CCTV 리스트 가져오기
 * @param data
 * @returns {Function}
 */
export const getCCTVList = (data) => async dispatch => {
    try {
        const response = await CCTVApi.getCCTVList(data);
        if (response !== null) {
            dispatch({type: GET_CCTV_LIST, payload: response});
            return true;
        }
        return false;
    } catch(err) {
        console.log(err);
        return false;
    }
};