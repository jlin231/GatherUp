import { csrfFetch } from "./csrf";

const LOAD_SINGLE_MEMBERSHIP = 'membership/single/load';
const APPROVE_SINGLE_MEMBERSHIP = 'membership/single/approve'
const DELETE_SINGLE_MEMBERSHIP = 'membership/single/delete'

const actionLoadSingleMembership = (data) => {
    return {
        type: LOAD_SINGLE_MEMBERSHIP,
        data
    };
};

const actionApproveSingleMembership = (data) => {
    return {
        type: APPROVE_SINGLE_MEMBERSHIP,
        data
    };
};

const actionDeleteSingleMembership = (data) => {
    return {
        type: DELETE_SINGLE_MEMBERSHIP,
        data: data
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

export const thunkApproveSingleMembership = (groupId, memberId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "memberId": memberId,
            "status": "member"
        })
    });
    let data;
    data = await response.json();
    dispatch(actionApproveSingleMembership(data));
    return data;
};

export const thunkDeleteSingleMembership = (groupId, memberId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "memberId": memberId,
        })
    });
    let data;
    data = await response.json();
    dispatch(actionDeleteSingleMembership(memberId));
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
        case APPROVE_SINGLE_MEMBERSHIP:
            newState = Object.assign({}, state);

            for (let i = 0; i < newState.groupMembers.length; i++) {
                console.log(newState.groupMembers[i].id, action.data.memberId, newState.groupMembers[i].Membership.status)
                if (newState.groupMembers[i].id === action.data.memberId) {
                    newState.groupMembers[i].Membership.status = 'member'
                }
            }
            console.log('newstate', newState)
            return newState;
        case DELETE_SINGLE_MEMBERSHIP:
            newState = Object.assign({}, state);
            if (newState.groupMembers.length === 1) {
                newState.groupMembers.splice(0, 1)
                return newState
            }
            for (let i = 0; i < newState.groupMembers.length; i++) {
                console.log(newState.groupMembers[i].id, action.data, newState.groupMembers[i].Membership.status)
                if (newState.groupMembers[i].id === action.data) {
                    newState.groupMembers.splice(i, 1)
                }
            }
            console.log('delete newstate', newState)
            return newState;
        default:
            return state;
    }
};

export default memberReducer;
