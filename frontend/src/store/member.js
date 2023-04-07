import { csrfFetch } from "./csrf";

const LOAD_SINGLE_MEMBERSHIP = 'membership/single/load';


const actionLoadSingleMembership = (data) => {
    return {
        type: LOAD_SINGLE_MEMBERSHIP,
        data
    };
};

export const thunkLoadSingleMembership = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/members`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    let data;
    data = await response.json();
    dispatch(actionLoadSingleMembership(data));
    return data;
};

const initialState = {};

const memberReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_SINGLE_MEMBERSHIP:
            newState = Object.assign({}, state);
            newState.groupMembers = action.data.Members;
            return newState;
        default:
            return state;
    }
};

export default memberReducer;
