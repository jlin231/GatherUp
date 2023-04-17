import { csrfFetch } from "./csrf";

const LOAD_SINGLE_EVENT_ATTENDENCE = 'attendence/single/load';
const JOIN_SINGLE_EVENT_ATTENDENCE = 'attendence/single/join';

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

export const thunkJoinSingleEventAttendence = (eventId) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}/attendence`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    let data;
    data = await response.json();
    console.log(data, 'data from getting all attendees')
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
            newState.singleAttendees = action.data.Attendees
            return newState;
        default:
            return state;
    }
};

export default attendenceReducer;
