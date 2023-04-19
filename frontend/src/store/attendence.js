import { csrfFetch } from "./csrf";

const LOAD_SINGLE_EVENT_ATTENDENCE = 'attendence/single/load';
const JOIN_SINGLE_EVENT_ATTENDENCE = 'attendence/single/join';
const APPROVE_EVENT_ATTENDENCE = 'attendence/single/join/approve';
const DELETE_EVENT_ATTENDENCE = 'attendence/single/join/delete';

const actionLoadSingleEventAttendence = (data) => {
    return {
        type: LOAD_SINGLE_EVENT_ATTENDENCE,
        data
    };
};

const actionJoinSingleEvent = (data) => {
    return {
        type: JOIN_SINGLE_EVENT_ATTENDENCE,
        data
    };
};

const actionApproveSingleEvent = (data) => {
    return {
        type: APPROVE_EVENT_ATTENDENCE,
        data
    };
};

const actionDeleteSingleEvent = (data) => {
    return {
        type: DELETE_EVENT_ATTENDENCE,
        data
    };
};


export const thunkLoadSingleEventAttendence = (eventId) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}/attendees`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    let data;
    data = await response.json();
    console.log(data, 'data from getting all attendees')
    dispatch(actionLoadSingleEventAttendence(data));
    return data;
};

export const thunkDeleteSingleEventAttendence = (eventId, userId) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}/attendance`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "userId": userId
        })
    });
    let data;
    data = await response.json();
    console.log(data, 'data from deleting attendees')
    dispatch(actionDeleteSingleEvent(userId));
    return data;
};


export const thunkApproveSingleEventAttendence = (eventId, userId) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}/attendance`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
            {
                "userId": userId,
                "status": "attending"
            }
        )
    });
    let data;
    data = await response.json();
    dispatch(actionApproveSingleEvent(data));
    return data;
};

export const thunkJoinSingleEventAttendence = (eventId) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    let data;
    data = await response.json();
    console.log(data, 'data from requesting/joining an event')
    dispatch(actionJoinSingleEvent(data));
    return data;
};

const initialState = {};

const attendenceReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_SINGLE_EVENT_ATTENDENCE:
            newState = Object.assign({}, state);
            newState.singleAttendees = action.data.Attendees
            return newState;
        case JOIN_SINGLE_EVENT_ATTENDENCE:
            newState = Object.assign({}, state);
            return newState;
        case APPROVE_EVENT_ATTENDENCE:
            newState = Object.assign({}, state);
            for (let i = 0; i < newState.singleAttendees.length; i++) {
                if (newState.singleAttendees[i] === action.data.userId) {
                    newState.singleAttendees[i].Attendence.status = "attending"
                }
            }
            return newState;
        case DELETE_EVENT_ATTENDENCE:
            newState = Object.assign({}, state);
            for (let i = 0; i < newState.singleAttendees.length; i++) {
                if (newState.singleAttendees[i] === action.data) {
                    newState.singleAttendees.splice(i, 1)
                    return newState
                }
            }
            return newState;
        default:
            return state;
    }
};

export default attendenceReducer;
