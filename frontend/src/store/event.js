import { csrfFetch } from "./csrf";

const LOAD_EVENTS = 'event/load';
const LOAD_EVENT_DETAILS = 'event/load/details';
const CREATE_EVENT = 'event/create'
const LOAD_GROUP_EVENTS = 'event/group/load'
const DELETE_EVENT = 'event/delete';

const actionLoadEvents = (events) => {
    return {
        type: LOAD_EVENTS,
        events
    };
};

const actionDeleteEvent = (eventId) => {
    return {
        type: DELETE_EVENT,
        eventId
    };
};

const actionLoadGroupEvents = (events) => {
    return {
        type: LOAD_GROUP_EVENTS,
        events
    };
};

const actionLoadEventDetails = (event) => {
    return {
        type: LOAD_EVENT_DETAILS,
        event
    };
};

const actionCreateEvent = (event) => {
    return {
        type: CREATE_EVENT,
        event
    };
};

export const thunkLoadEvents = () => async dispatch => {
    const response = await fetch('/api/events', {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    let data = await response.json();
    //normalize data
    let normalizeData = {};
    data.Events.forEach((group) => {
        normalizeData[group.id] = group;
    });
    dispatch(actionLoadEvents(normalizeData));
    return normalizeData;
};

export const thunkDeleteEvent = (eventId) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
        let data = await response.json();
        dispatch(actionDeleteEvent(eventId));
        return data;
    }
};

export const thunkCreateEvent = (info, groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info)
    });
    let data = await response.json();
    //normalize data
    dispatch(actionCreateEvent(data));
    return data;
};
//get all events associated with groupId
export const thunkLoadGroupEvents = (groupId) => async dispatch => {
    const response = await fetch(`/api/groups/${groupId}/events`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    let data = await response.json();
    //normalize data
    dispatch(actionLoadGroupEvents(data));
    return data;
};

export const thunkLoadEventDetails = (id) => async (dispatch, getState) => {
    const response = await fetch(`/api/events/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
    if (response.ok) {
        const data = await response.json();
        dispatch(actionLoadEventDetails(data));
        return data;
    }
}

const initialState = {};

const eventReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_EVENTS:
            newState = Object.assign({}, state);
            newState.allEvents = action.events;
            return newState;
        case LOAD_EVENT_DETAILS:
            newState = Object.assign({}, state);
            newState.singleEvent = action.event;
            return newState;
        case CREATE_EVENT:
            newState = Object.assign({}, state);
            newState.allEvents[action.event.id] = action.event;
            return newState;
        case LOAD_GROUP_EVENTS:
            //loads events associated with a group, no state change
            return state;
        case DELETE_EVENT:
            newState = Object.assign({}, state);
            if(newState.singleEvent.id === action.eventId){
                delete newState.singleGroup;
            }; 
            delete newState.allEvents[action.eventId]; 
            return newState;
        default:
            return state;
    }
};

export default eventReducer;
