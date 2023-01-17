const LOAD_GROUP = 'group/load';
const CREATE_GROUP = 'group/create';

const actionLoadGroup = (groups) => {
    return {
        type: LOAD_GROUP,
        groups
    };
};

const actionCreateGroup = (info) => {
    return {
        type: CREATE_GROUP,
        info
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

export const thunkCreateGroup = (info) => async dispatch => {
    console.log('info', info)
    const response = await fetch('/api/groups', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info)
    });
    let data = await response.json();
    console.log(data);
    //normalize data
    dispatch(actionCreateGroup(data));
    return data; 
};

const initialState = {};

const groupReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_GROUP:
            newState = Object.assign({}, state);
            newState.allGroups = action.groups;
            return newState;
        case CREATE_GROUP: {
            newState = Object.assign({}, state);
            newState.allGroups[action.info.id] = action.info
            console.log(newState); 
            return newState;
        }
        default:
            return state;
    }
};

export default groupReducer;