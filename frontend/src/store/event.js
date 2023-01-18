const LOAD_EVENTS = 'event/load';
const LOAD_EVENT_DETAILS = 'event/load/details'; 

const actionLoadEvents = (events) => {
    return {
        type: LOAD_EVENTS,
        events
    };
};

const actionLoadEventDetails = (event) => {
    return {
        type: LOAD_EVENT_DETAILS,
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

export const thunkLoadEventDetails = (id) => async (dispatch, getState) => {
    const response = await fetch(`/api/groups/${id}`, {
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
        default:
            return state;
    }
};

export default eventReducer;
