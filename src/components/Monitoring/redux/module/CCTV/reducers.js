import {GET_CCTV_LIST} from "./CCTVactions";

const initialState = {
    cctvList: null,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_CCTV_LIST:
            return {
                ...state,
                cctvList: payload
            };
        default:
            return state;
    }
};