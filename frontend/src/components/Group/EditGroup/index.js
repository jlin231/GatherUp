import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { thunkEditGroup } from '../../../store/group';
import { thunkLoadGroupDetails } from '../../../store/group';
import './EditGroup.css';

function EditGroupComponent() {
    const dispatch = useDispatch();
    const history = useHistory();
    let { groupId } = useParams();
    groupId = +groupId;

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [about, setAbout] = useState("");
    const [city, setCity] = useState("");
    const [privacy, setPrivacy] = useState("");
    const [state, setState] = useState("");
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    //use current user in store, validation already done in previous component
    const groups = useSelector((state) => state.groups.allGroups);

    useEffect(() => {
        if (groups) {
            const singleGroup = groups[groupId];
            setName(singleGroup.name);
            setAbout(singleGroup.about);
            setType(singleGroup.type);
            setPrivacy(singleGroup.private);
            setCity(singleGroup.city);
            setState(singleGroup.state);
        }

    }, [groups, groupId])

    //if form has been sumitted, and there are no errors
    useEffect(() => {
        if (hasSubmitted && errors.length === 0) {
            dispatch(thunkLoadGroupDetails(groupId));
            history.push(`/group/${groupId}/about`)
        }
    }, [hasSubmitted, groupId, dispatch, errors.length, history])


    function handleSubmit(e) {
        e.preventDefault();
        //keeps track on if form has been submitted
        setErrors([]);
        setHasSubmitted(false);
        console.log('errors before', errors);
        const info = {
            name,
            about,
            type,
            private: Boolean(privacy),
            city,
            state
        }
        dispatch(thunkEditGroup(info, groupId)).then(() => {
            //if dispatch does not return an error, then set hasSubmitted to be true
            setHasSubmitted(true);
        })
            .catch(
                async (res) => {
                    // console.log('res', res);
                    const data = await res.json();
                    // console.log('data', data);
                    if (data && data.errors) {
                        // console.log('test')
                        const values = Object.values(data.errors);
                        // console.log('values', values);
                        setErrors([values]);
                        setHasSubmitted(false);
                        // console.log('errors', errors);
                    }
                });
    };

    return (
        <>
            <div>Edit Group</div>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <label>
                    Name
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    About
                    <textarea
                        type="text"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        required>

                    </textarea>
                </label>
                <label>
                    Type
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option value="" ></option>
                        <option value="In person">In person</option>
                        <option value="Online">Online</option>
                    </select>
                </label>
                <label>
                    Private
                    <select
                        value={privacy}
                        onChange={(e) => setPrivacy(e.target.value)}
                        required
                    >
                        <option value=""></option>
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                    </select>
                </label>
                <label>
                    City
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </label>
                <label>
                    State
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </>
    );
}

export default EditGroupComponent;
