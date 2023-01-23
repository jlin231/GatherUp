import { csrfFetch } from "./csrf";

const LOAD_GROUP = 'group/load';
const CREATE_GROUP = 'group/create';
const LOAD_GROUP_DETAILS = 'group/details';
const EDIT_GROUP = "group/edit";
const DELETE_GROUP = "group/delete"

const actionLoadGroup = (groups) => {
    return {
        type: LOAD_GROUP,
        groups
    };
};

const actionDeleteGroup = (groupId) => {
    return {
        type: DELETE_GROUP,
        groupId
    };
};

const actionEditGroup = (info) => {
    return {
        type: EDIT_GROUP,
        info
    };
};

const actionLoadGroupDetails = (group) => {
    return {
        type: LOAD_GROUP_DETAILS,
        group: group
    };
};

const actionCreateGroup = (info) => {
    return {
        type: CREATE_GROUP,
        info
    };
};

export const thunkDeleteGroup = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    });
    if (response.ok) {
        let data = await response.json();
        dispatch(actionDeleteGroup(groupId));
        return data;
    }
};

export const thunkEditGroup = (info, groupId) => async dispatch => {
    console.log('edit')
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info)
    });
    let data = await response.json();
    console.log('response obtained', data)
    //normalize data
    dispatch(actionEditGroup(data));
    return response;
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
    });
    dispatch(actionLoadGroup(normalizeData));
    return normalizeData;
};

export const thunkCreateGroup = (info) => async dispatch => {
    const response = await csrfFetch('/api/groups', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info)
    });
    let data;
    data = await response.json();
    if (data.id) {
        const imageResponse = await csrfFetch(`/api/groups/${data.id}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "url": info.previewImage,
                "preview": true
            })
        })
    }
    dispatch(actionCreateGroup(data));
    return data;
};

export const thunkLoadGroupDetails = (id) => async (dispatch, getState) => {
    const response = await fetch(`/api/groups/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
    if (response.ok) {
        const data = await response.json();
        dispatch(actionLoadGroupDetails(data));
        return data;
    }
}

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
            newState.allGroups[action.info.id] = action.info;
            return newState;
        }
        case LOAD_GROUP_DETAILS: {
            newState = Object.assign({}, state);
            newState.singleGroup = action.group;
            return newState;
        }
        case EDIT_GROUP: {
            //load new group with thunk, update allGroups
            newState = Object.assign({}, state);
            newState.allGroups[action.info.id] = {
                ...newState.allGroups[action.info.id],
                name: action.info.name,
                about: action.info.about,
                type: action.info.type,
                private: action.info.private,
                city: action.info.city,
                state: action.info.state,
                createdAt: action.info.createdAt,
                updatedAt: action.info.updatedAt
            }
            return newState;
        }
        case DELETE_GROUP: {
            newState = Object.assign({}, state);
            if (newState.singleGroup.id === action.groupId) {
                delete newState.singleGroup;
            }
            delete newState.allGroups[action.groupId];
            
            //add functionality to delete events

            return newState
        }
        default:
            return state;
    }
};

export default groupReducer;
