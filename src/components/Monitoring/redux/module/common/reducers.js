import {SET_LOADING} from "./actions";

const initialState = {
    loading: false
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_LOADING:
            return {
                ...state,
                loading: payload
            };
        default:
            return state;
    }
};