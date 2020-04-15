import { AUTH_SUCCESS, LOGOUT } from '../../actions/types';

const initialState = {
    currentUser: {},
    token: null,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case AUTH_SUCCESS:
            return {
                ...payload,
            };
        case LOGOUT:
            return {
                ...initialState,
            };
        default:
            return state;
    }
};
