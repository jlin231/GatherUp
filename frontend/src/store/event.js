const LOAD_EVENTS = 'event/load';

const actionLoadEvents = (events) => {
    return {
        type: LOAD_EVENTS,
        events
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

const initialState = {};

const eventReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_EVENTS:
            newState = Object.assign({}, state);
            newState.allEvents = action.events;
            return newState;
        default:
            return state;
    }
};

export default eventReducer;
