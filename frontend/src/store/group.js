const LOAD_GROUP = 'group/load';

const actionLoadGroup = (groups) => {
    return {
        type: LOAD_GROUP,
        groups
    };
};


export const thunkLoadGroups = () => async dispatch => {
    const response = await fetch('/api/groups', {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    let data = await response.json();
    //normalize data
    let normalizeData = {};
    data.Groups.forEach((group) => {
        normalizeData[group.id] = group;
    })
    dispatch(actionLoadGroup(normalizeData));
    return normalizeData;
};

const initialState = {};

const groupReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_GROUP:
            newState = Object.assign({}, state);
            newState.allGroups = action.groups;
            return newState;
        default:
            return state;
    }
};

export default groupReducer;
