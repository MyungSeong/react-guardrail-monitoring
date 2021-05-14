export const SET_LOADING = 'common/SET_LOADING';

/**
 * 로딩 모듈
 * @param status
 * @returns {Function}
 */
export const setLoading = (status) => (dispatch) => {
    dispatch({ type: SET_LOADING, payload: status });
};
